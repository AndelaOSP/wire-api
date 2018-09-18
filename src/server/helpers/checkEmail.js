/**
* Checks if the email provided is an Andela email address 
* @function checkEmail
* @param Email
* @return Boolean
**/
const checkEmail = emailAddress => {

  if (emailAddress.endsWith('@andela.com')) {
    return true;
  }
  return false;
};

module.exports = checkEmail;
