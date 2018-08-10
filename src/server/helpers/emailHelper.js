const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

/**
 * @function sendMail
 * @param Object
 * @param function
 */
const sendMail = (emailBody, callback) => {
  const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
    logger: true,
    debug: false
  }));
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: emailBody.to,
    subject: emailBody.subject,
    message: emailBody.message,
    html: emailBody.message
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      callback(error);
      return;
    }

    callback(null);
  });
};

module.exports = { sendMail };
