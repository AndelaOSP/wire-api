const {
  notificationGroups,
} = require('../utils/data/notification-groups.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('NotificationGroups', notificationGroups);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('NotificationGroups', null);
  },
};
