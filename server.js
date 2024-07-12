const { SMTPServer } = require("smtp-server");

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
    stream.on("end", () => {
      console.log("Received email:", email);
      callback(null); // Accept the message
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
