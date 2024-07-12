const nodemailer = require("nodemailer");
const dkim = require("nodemailer-dkim");
const fs = require("fs");
let transporter = nodemailer.createTransport({
  host: "mail.bablast.id",
  port: 465,
  secure: true,
  auth: {
    user: "username", // Ganti dengan username Anda
    pass: "password", // Ganti dengan password Anda
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.use(
  "stream",
  dkim.signer({
    domainName: "bablast.id",
    keySelector: "default",
    privateKey: fs.readFileSync("dkim_private.pem", "utf8"),
  })
);

transporter.sendMail(
  {
    from: "info@bablast.id",
    to: "404.ginda@gmail.com",
    subject: "Hello with DKIM",
    text: "This email is sent with DKIM signed.",
  },
  (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  }
);
