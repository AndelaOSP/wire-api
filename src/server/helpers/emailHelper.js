const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const util = require('util');
const fs = require('fs');
const emailTemplate = fs.readFileSync('templates/emailTemplate.html', 'utf8');

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
  const logo = 'https://portal.andela.com/assets/logo-cf374247ec55390fbde32f80367f77187dc7c11cc4774b38d0e5b143d0d2d334.png';
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: emailBody.to,
    subject: emailBody.subject,
    html: util.format(emailTemplate,
      logo,
      emailBody.message)
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
