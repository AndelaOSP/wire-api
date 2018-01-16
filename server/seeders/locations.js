'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Locations', [{
      name: 'Quiet Room',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Cafeteria',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Block A 1st Floor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'Block A 2nd Floor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Tsavo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Bootcamp Room',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    ]);
  },

  down(queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Locations', null);
  }
};
