const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'basdHokage@gmail.com',
    pass: 'Chuchi22*7',
  },
  logger: true,
  debug: false
}));

/**
 * @function sendMail
 * @param Object
 * @param function
 */
const sendMail = (emailBody, callback) => {
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

module.exports = {sendMail};
