const { notifications } = require('../utils/data/notifications.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Notifications', notifications);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Notifications', null);
  },
};
