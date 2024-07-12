const { SMTPServer } = require("smtp-server");
const fs = require("fs");
const path = require("path");
const { simpleParser } = require("mailparser");

// Lokasi sertifikat yang diperbarui oleh Certbot
const KEY_PATH = "/etc/letsencrypt/live/mail.bablast.id/privkey.pem";
const CERT_PATH = "/etc/letsencrypt/live/mail.bablast.id/cert.pem";
const CA_PATH = "/etc/letsencrypt/live/mail.bablast.id/chain.pem";

const options = {
  name: "mail.bablast.id",
  secure: true,
  key: fs.readFileSync(KEY_PATH, "utf8"),
  cert: fs.readFileSync(CERT_PATH, "utf8"),
  ca: [fs.readFileSync(CA_PATH, "utf8")],
  onAuth(auth, session, callback) {
    // Sederhana otentikasi dengan username dan password
    const validUsernames = { user1: "password1", user2: "password2" };
    if (
      auth.username in validUsernames &&
      auth.password === validUsernames[auth.username]
    ) {
      console.log(`Authenticated user: ${auth.username}`);
      return callback(null, { user: auth.username });
    } else {
      console.log(`Authentication failed for user: ${auth.username}`);
      return callback(new Error("Invalid username or password"));
    }
  },
  onData(stream, session, callback) {
    simpleParser(stream, (err, parsed) => {
      if (err) {
        console.error("Error parsing email:", err);
        return callback(err);
      }

      // Tampilkan isi email di log untuk keperluan debug (tidak disarankan di produksi)
      console.log(`From: ${parsed.from.text}`);
      console.log(`To: ${parsed.to.text}`);
      console.log(`Subject: ${parsed.subject}`);
      console.log(`Body: ${parsed.text}`);

      // Tugas Anda untuk memutuskan apa yang harus dilakukan dengan parsed mail
      // Misalnya menyimpan di database, meneruskan ke sistem lain, dll.

      callback(null, "Message received");
    });
  },
};

const server = new SMTPServer(options);
server.listen(465, () => {
  console.log("Secure SMTP Server is running on port 465");
});
