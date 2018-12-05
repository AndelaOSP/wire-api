/**
 * Checks if the email provided is an Andela email address
 * @function checkEmail
 * @param Email
 * @return Boolean
 **/
const checkEmail = emailAddress => emailAddress.endsWith('@andela.com');
module.exports = checkEmail;
