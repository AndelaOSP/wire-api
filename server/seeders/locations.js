

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Locations', [{
      name: 'Quiet Room',
      centre: 'Nairobi',
      country: 'Kenya',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Cafeteria',
      centre: 'Nairobi',
      country: 'Kenya',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Block A 1st Floor',
      centre: 'Nairobi',
      country: 'Kenya',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'Block A 2nd Floor',
      centre: 'Nairobi',
      country: 'Kenya',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Tsavo',
      centre: 'Nairobi',
      country: 'Kenya',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Bootcamp Room',
      centre: 'Nairobi',
      country: 'Kenya',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    ]);
  },

  down(queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Locations', null);
  }
};
