const nodemailer = require("nodemailer");

// Buat transporter untuk mengirim email
let transporter = nodemailer.createTransport({
  host: "mail.bablast.id",
  port: 25,
  secure: false, // true untuk port 465, false untuk port lainnya
  auth: {
    user: "user", // ganti dengan username yang Anda gunakan pada server SMTP
    pass: "password", // ganti dengan password yang Anda gunakan pada server SMTP
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Konfigurasi email yang akan dikirim
let mailOptions = {
  from: '"Your Name" <your-email@bablast.id>', // Pengirim
  to: "404.ginda@gmail.com", // Penerima
  subject: "Hello", // Subjek
  text: "Hello world?", // Teks biasa
  html: "<b>Hello world?</b>", // Teks HTML
};

// Kirim email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});
