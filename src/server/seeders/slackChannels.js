const slack = require('../utils/data/slack-channels.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('SlackChannels', slack.SlackChannels);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('SlackChannels', null);
  },
};
