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
        type: Sequelize.STRING,
        allowNull: false,
        allowEmpty: false,
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
