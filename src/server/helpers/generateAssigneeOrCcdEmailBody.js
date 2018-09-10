const getUsernameFromEmail = require('./getUsernameFromEmail');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const models = require('../models');

/**
 * @function generateEmailBody
 * @param email
 * @param roleId
 * @return email body
*/

module.exports = async userDetails => {
  try {
    console.log('3rd USERDETAILS: ', userDetails);
    const name = getUsernameFromEmail(userDetails.email);
    console.log('THE NAME: ', name)
    let body;
    const assignee = await models.assigneeIncidents.findOne({ where: { assignedRole: 'assignee',
      incidentId: userDetails.incidentId} });
    console.log('ANOTHER ASSIGNEE: ', assignee)
    const assingedUser = await models.Users.findById(assignee.userId);

    if (userDetails.roleId === 3) {
      body = {
        subject: `An incident has been assigned to ${assingedUser.username}` ,
        message: `Hi <strong>${name.first} ${name.last} </strong>,<br/> 
      ${assingedUser.username} has been assinged this </strong>. 
      <a href="${config.WIRE_BASE_URL}/incidents/${userDetails.incidentId}">Incident</a>.`,
        to: userDetails.email,
      };
      return body;
    } else if(assignee) {
      body = {
        subject: 'You have been assigned an incident',
        message: `Hi <strong>${name.first} ${name.last} </strong>,<br/> 
      You've been assigned an incident on <strong>WIRE(Workspace Incident Reporting)</strong>. 
      Click <a href="${config.WIRE_BASE_URL}/incidents/${userDetails.incidentId}">here</a> to view it.`,
        to: userDetails.email,
      };
      return body;
    }
  } catch (error) {
    console.log('ERROR', error);
    return error;
  }
};
