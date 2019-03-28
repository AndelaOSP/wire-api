'use strict';
let cuid = require('cuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('userSlackEvents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: () => cuid()
      },
      username: {
        type: Sequelize.STRING
      },
      channel_name: {
        type: Sequelize.STRING
      },
      slackEventId: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'slackEvents',
          key: 'id',
          as: 'slackEventId'
        }
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
    return queryInterface.dropTable('userSlackEvents');
  }
};
