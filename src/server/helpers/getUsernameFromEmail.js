/**
 * @function getUsernameFromEmail
 * @param STRING email
 * @returns Object name
 */

module.exports = email => {
  let name = {};
  let first = '';
  let last = '';
  const email_username = email.split('@')[0].split('.');
  if (email_username.length > 1) {
    // email has '.'
    first =
      email_username[0].charAt(0).toUpperCase() + email_username[0].slice(1);

    last =
      email_username[1].charAt(0).toUpperCase() + email_username[1].slice(1);

    name = { first, last };
  } else {
    // email doesn't have '.'
    first =
      email_username[0].charAt(0).toUpperCase() + email_username[0].slice(1);

    name = { first, last };
  }
  return name;
};
