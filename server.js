const { SMTPServer } = require("smtp-server");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const app = express();

// Fungsi untuk memuat kunci DKIM berdasarkan domain
function getDkimOptions(domain) {
  const keySelector = "default";
  const privateKeyPath = path.join(__dirname, "dkim", `${domain}-private.pem`);

  if (fs.existsSync(privateKeyPath)) {
    return {
      domainName: domain,
      keySelector: keySelector,
      privateKey: fs.readFileSync(privateKeyPath, "utf8"),
    };
  } else {
    return null;
  }
}

// Fungsi untuk membuat kunci DKIM
function generateDkimKeys(domain) {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  const privateKeyPath = path.join(__dirname, "dkim", `${domain}-private.pem`);
  const publicKeyPath = path.join(__dirname, "dkim", `${domain}-public.pem`);

  fs.writeFileSync(privateKeyPath, keyPair.privateKey);
  fs.writeFileSync(publicKeyPath, keyPair.publicKey);

  return {
    privateKey: keyPair.privateKey,
    publicKey: keyPair.publicKey,
  };
}

// Endpoint untuk membuat kunci DKIM
app.get("/generate-dkim/:domain", (req, res) => {
  const domain = req.params.domain;
  const keys = generateDkimKeys(domain);
  res.json({
    message: `DKIM keys generated for ${domain}`,
    publicKey: keys.publicKey,
  });
});

const server = new SMTPServer({
  name: "mail.bablast.id",
  onAuth(auth, session, callback) {
    if (auth.username === "user" && auth.password === "password") {
      callback(null, { user: "user" });
    } else {
      callback(new Error("Authentication failed"));
    }
  },
  onData(stream, session, callback) {
    let email = "";
    stream.on("data", (chunk) => {
      email += chunk.toString();
    });
    stream.on("end", async () => {
      console.log("Received email:", email);

      const fromDomain = session.envelope.mailFrom.address.split("@")[1];
      const dkimOptions = getDkimOptions(fromDomain);

      if (!dkimOptions) {
        return callback(
          new Error(`DKIM configuration not found for domain: ${fromDomain}`)
        );
      }

      // Kirim email menggunakan Nodemailer dengan DKIM
      let transporter = nodemailer.createTransport({
        host: "mail.bablast.id",
        port: 25,
        secure: false,
        auth: {
          user: "user",
          pass: "password",
        },
        dkim: dkimOptions,
      });

      let mailOptions = {
        from: session.envelope.mailFrom.address,
        to: session.envelope.rcptTo.map((rcpt) => rcpt.address).join(", "),
        raw: email,
      };

      try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        callback(null); // Accept the message
      } catch (error) {
        console.log(error);
        callback(error);
      }
    });
  },
  onMailFrom(address, session, callback) {
    console.log("Mail from:", address.address);
    callback();
  },
  onRcptTo(address, session, callback) {
    console.log("Mail to:", address.address);
    callback();
  },
  logger: true,
});

server.listen(25, () => {
  console.log("SMTP server is listening on port 25");
});

// Jalankan server Express
app.listen(3000, () => {
  console.log("DKIM key generation server is listening on port 3000");
});
