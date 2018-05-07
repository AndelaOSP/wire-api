
let cuid = require('cuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Chats', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: () => cuid()
      },
      chat: {
        type: Sequelize.TEXT
      },
      userEmail: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'email',
          as: 'userEmail',
          allowNull: false
        }
      },
      incidentId: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Incidents',
          key: 'id',
          as: 'incidentId',
          allowNull: false
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
    return queryInterface.dropTable('Chats');
  }
};
