const { SMTPServer } = require("smtp-server");
const { simpleParser } = require("mailparser");
const fs = require("fs");

// Baca kunci privat dan sertifikat SSL
const privateKey = fs.readFileSync("server.key", "utf8");
const certificate = fs.readFileSync("server.cert", "utf8");

// Membuat instansi dari SMTPServer dengan SSL
const server = new SMTPServer({
  // Mengatur hostname
  name: "mail.bablast.id",

  // Mengaktifkan SSL
  secure: true,
  key: privateKey,
  cert: certificate,

  // Log lalu lintas masuk untuk debugging
  logger: true,

  // Menangani pesan masuk di sini
  onData(stream, session, callback) {
    simpleParser(stream, (err, parsed) => {
      if (err) {
        console.error(err);
        return callback(err);
      }

      console.log("Subject:", parsed.subject);
      console.log("Body:", parsed.text);
      callback(null, "Pesan berhasil diproses");
    });
  },

  onAuth(auth, session, callback) {
    if (auth.username === "username" && auth.password === "password") {
      return callback(null, { user: "Pengguna Terotentikasi" });
    }
    return callback(new Error("Username atau password tidak valid"));
  },
});

// Menjalankan server SMTP di port 465 (port standar untuk SMTPS)
server.listen(465, () => {
  console.log("Server SMTP dengan SSL berjalan di port 465");
});
