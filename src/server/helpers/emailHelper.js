const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const util = require('util');
const fs = require('fs');
const axios = require('axios');

const emailTemplate = fs.readFileSync('templates/emailTemplate.html', 'utf8');
const emailVerificationUrl = process.env.EMAIL_VERIFICATION_URL;
const apiToken = process.env.API_TOKEN;
const instance = axios.create();

/**
 * @function sendMail
 * @param Object
 * @param function
 */
const sendMail = (emailBody, callback) => {
  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
      logger: true,
      debug: false,
    })
  );
  const logo =
    'https://portal.andela.com/assets/logo-cf374247ec55390fbde32f80367f77187dc7c11cc4774b38d0e5b143d0d2d334.png';
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: emailBody.to,
    subject: emailBody.subject,
    html: util.format(emailTemplate, logo, emailBody.message),
  };
  transporter.sendMail(mailOptions, error => {
    if (error) {
      callback(error);
      return;
    }
    callback(null);
  });
};

/**
 * @function verifyEmail
 * @param String email
 * @return Boolean
 */
const verifyEmail = async email => {
  instance.defaults.headers.common['api-token'] = apiToken;
  try {
    const response = await instance.get(
      `${emailVerificationUrl}?email=${email}`
    );
    return response.data.values.length === 1;
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = { sendMail, verifyEmail };
