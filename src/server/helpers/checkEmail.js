/**
 * Checks if the email provided is an Andela email address
 * @function checkEmail
 * @param Email
 * @return Boolean
 **/
module.exports = emailAddress => emailAddress.endsWith('@andela.com');
