/* eslint-disable max-lines-per-function */
const cuid = require('cuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: () => cuid(),
      },
      message: {
        type: Sequelize.TEXT,
      },
      notificationTypeId: {
        type: Sequelize.STRING,
        onDelete: 'NO ACTION',
        references: {
          model: 'NotificationTypes',
          key: 'id',
        },
      },
      incidentId: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Incidents',
          key: 'id',
        },
      },
      notificationGroupId: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'NotificationGroups',
          key: 'id',
          allowNull: false,
        },
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
    return queryInterface.dropTable('Notifications');
  },
};
