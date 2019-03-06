const { notificationTypes } = require('../utils/data/notification-types.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('NotificationTypes', notificationTypes);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('NotificationTypes', null);
  },
};
