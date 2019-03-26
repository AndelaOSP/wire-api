const {
  Notifications,
  NotificationGroups,
  NotificationTypes,
  UserGroups,
} = require('../models');

// Adds a notification
const findNotificationType = async name => {
  const type = await NotificationTypes.findOne({
    where: { name: { $eq: name } },
  });

  return type;
};

// Adds a notification group
const createNotificationGroup = async userIds => {
  // Create new notification group
  const group = await NotificationGroups.create();

  // Get each userId and add entry to join table.
  for (let i = 0; i < userIds.length; i += 1) {
    await UserGroups.create({
      notificationGroupId: group.id,
      userId: userIds[i],
    });
  }

  return group;
};

// Adds a notification
const createNotification = async (notifType, userIds, incidentId, message) => {
  // Get notification id
  const { id: notificationTypeId } = await findNotificationType(notifType);

  // Create notification group
  const { id: notificationGroupId } = await createNotificationGroup(userIds);

  // Create new notification
  const notif = await Notifications.create({
    notificationGroupId,
    notificationTypeId,
    incidentId,
    message,
  });

  return notif;
};

module.exports = {
  findNotificationType,
  createNotificationGroup,
  createNotification,
};
