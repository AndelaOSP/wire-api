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
      eventTs: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'slackUsers',
          key: 'id',
          as: 'userId'
        }
      },
      ts: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.TEXT
      },
      channelId: {
        type: Sequelize.STRING
      },
      channelType: {
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
