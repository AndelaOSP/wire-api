'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Statuses', [{
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      status: 'In Progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
    status: 'Resolved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }]);
  },

  down(queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Statuses', null);
  }
};
