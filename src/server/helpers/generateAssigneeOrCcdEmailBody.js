const getUsernameFromEmail = require('./getUsernameFromEmail');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];


/**
 * @function generateEmailBody
 * @param email
 * @param roleId
 * @return email body
*/

module.exports = async userDetails => {
  try {
    const name = getUsernameFromEmail(userDetails.email);
    let body;
    if (userDetails.assignedRole === 'ccd') {
      body = {
        subject: 'An incident has been assigned.' ,
        message: `Hi <strong>${name.first} ${name.last} </strong>,<br/> 
      A user has been assinged this </strong>. 
      <a href="${config.WIRE_BASE_URL}/timeline/${userDetails.incidentId}">Incident</a>.`,
        to: userDetails.email,
      };
      return body;
    }
    
    body = {
      subject: 'You have been assigned an incident',
      message: `Hi <strong>${name.first} ${name.last} </strong>,<br/> 
      You've been assigned an incident on <strong>WIRE(Workspace Incident Reporting)</strong>. 
      Click <a href="${config.WIRE_BASE_URL}/timeline/${userDetails.incidentId}">here</a> to view it.`,
      to: userDetails.email,
    };
    return body;
  } catch (error) {
    throw error;
  }
};