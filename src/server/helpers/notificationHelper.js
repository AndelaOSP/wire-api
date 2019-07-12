const { createNotification } = require('../controllers/notifications');

let message;
const handleCCUpdateNotification = async (
  req,
  ccdUser,
  incidentId,
  message
) => {
  // Get ccd users
  let userIds = ccdUser.map(user => user.userId);
  message = '"You were CC\'d in an incident"';
  // Send notification to client about a CC'd user
  req.app.socket.notifyCCChange(userIds, message);
  // Create notification
  await createNotification('CC_ON_INCIDENT', userIds, incidentId, message);
};

const handleStatusUpdateNotification = async (
  req,
  assignedUsers,
  incidentId
) => {
  // Get assigned users, ccd and assignees
  let userIds = assignedUsers.map(user => user.id);
  message = 'Incident status has been updated';
  // Notify client
  req.app.socket.notifyIncidentStatusChange(userIds, message);

  await createNotification(
    'ASSIGNEE_STATUS_CHANGED',
    userIds,
    incidentId,
    message
  );
};
module.exports = {
  handleCCUpdateNotification,
  handleStatusUpdateNotification,
};
