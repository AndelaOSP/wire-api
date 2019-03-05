/* eslint-disable max-lines-per-function */
const cuid = require('cuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('NotificationTypes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: () => cuid(),
      },
      name: {
        type: Sequelize.ENUM(
          'ChatUpdate',
          'AssigneeStatusChanged',
          'CCOnIncident',
          'NewIncidentAdded',
          'AssignedToIncident'
        ),
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

  down: queryInterface => {
    return queryInterface.dropTable('NotificationTypes');
  },
};
