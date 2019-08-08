'use strict';
const cuid = require('cuid');

module.exports = {
  // eslint-disable-next-line max-lines-per-function
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SlackWireEvents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: () => cuid(),
      },
      type: {
        type: Sequelize.STRING,
      },
      eventTs: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.STRING,
      },
      ts: {
        type: Sequelize.STRING,
      },
      text: {
        type: Sequelize.TEXT,
      },
      channelId: {
        type: Sequelize.STRING,
      },
      channelType: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('SlackWireEvents');
  },
};
