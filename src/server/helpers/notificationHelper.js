const { createNotification } = require('../controllers/notifications');

const handleCCUpdateNotification = async (
  req,
  ccdUser,
  incidentId,
  message
) => {
  if (!ccdUser) return;

  // Get ccd users
  let userIds = ccdUser.map(user => user.userId);

  // Send notification to client about a CC'd user
  req.app.socket.notifyCCChange(userIds, '');

  // Create notification
  await createNotification('CC_ON_INCIDENT', userIds, incidentId, message);
};

module.exports = {
  handleCCUpdateNotification,
};
