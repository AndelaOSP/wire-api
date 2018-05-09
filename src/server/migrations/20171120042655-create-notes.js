
let cuid = require('cuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Notes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: () => cuid()
      },
      note: {
        type: Sequelize.TEXT
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Notes');
  }
};
