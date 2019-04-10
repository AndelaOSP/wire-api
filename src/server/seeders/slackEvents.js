const slackEvent = require('../utils/data/slackEvents.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('slackEvents', slackEvent.slackEvents);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('slackEvents', null);
  },
};
