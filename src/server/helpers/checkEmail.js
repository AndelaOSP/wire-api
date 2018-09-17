/**
* Checks if the email provided is an Andela email address 
* @function checkEmail
* @param Email
* @return String
**/
const checkEmail = emailAddress => {
  const idx = emailAddress.lastIndexOf('@');
  if (idx > -1 && emailAddress.slice(idx + 1) === 'andela.com') {
    
    return true;
  }
  return false;
};

module.exports = checkEmail;
