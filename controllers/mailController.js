var nodemailer = require("nodemailer");
const asyncErrorWrapper = require("express-async-handler");
const sendMail = asyncErrorWrapper(async (req, res) => {
  const { mail, name, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.orcabs.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "berke@orcabs.com", // generated ethereal user
      pass: "Password1", // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: "berke@orcabs.com",
    to: "berke@orcabs.com",
    subject: `${name} Expo Foods Midlands Contact Mail .`,
    text: message+ ` - User Mail Address : ${mail}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
      res.status(400).json({
        status: false,
        message: error,
      });
    } else {
      res.status(200).json({
        status: true,
        message: info.response,
      });
    }
  });
});
module.exports = { sendMail };
