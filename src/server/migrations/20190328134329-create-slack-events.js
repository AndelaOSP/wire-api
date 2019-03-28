'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('slackEvents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      event_ts: {
        type: Sequelize.STRING
      },
      user: {
        type: Sequelize.STRING
      },
      ts: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.TEXT
      },
      channel: {
        type: Sequelize.STRING
      },
      channel_type: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('slackEvents');
  }
};
