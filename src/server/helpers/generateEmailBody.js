const matchRoleIdToRoleName = require('./matchRoleIdToRoleName');
const getUsernameFromEmail = require('./getUsernameFromEmail');
/**
 * @function generateEmailBody
 * @param
 * @returns email body
*/

module.exports = async (email, roleId) => {
  const name = getUsernameFromEmail(email);
  const assignedRole = await matchRoleIdToRoleName(roleId);
  return {
    subject: 'Invite to join WIRE',
    message: `Hi <strong>${name.first} ${name.last} </strong>,<br/> 
    You've been invited to join <strong>WIRE(Workspace Incident Reporting)</strong> as ${assignedRole}. 
    Click on the following link ${process.env.WIRE_BASE_URL} to access WIRE.`,
    to: email,
  };
};
