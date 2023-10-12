const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "amr1313mk@gmail.com",
    pass: "dsxr ztps etwt xxdn",
  },
});

async function emailSender(email, subject, html) {
  await transporter.sendMail({
    from: "amr1313mk@gmail.com",
    to: email,
    subject: subject,
    text: subject,
    html: html,
  });
}

module.exports = { emailSender };
