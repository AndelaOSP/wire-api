'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles', [{
      name: 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Super Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
  }]);
  },

  down(queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Roles', null);
  }
};
