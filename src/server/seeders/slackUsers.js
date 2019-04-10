const slackUser = require('../utils/data/slackUsers.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('slackUsers', slackUser.slackUsers);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('slackUsers', null);
  },
};
