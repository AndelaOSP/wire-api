/**
 * @function getUsernameFromEmail
 * @param STRING email
 * @returns Object name
 */

module.exports = email => {
  let name = {};
  const [firstName, lastName] = email.split('@')[0].split('.');
  const first = firstName[0].toUpperCase() + firstName.substr(1, firstName.length);
  const last = lastName ? lastName[0].toUpperCase() + lastName.substr(1, lastName.length): '';
  return name = {first, last};
};
