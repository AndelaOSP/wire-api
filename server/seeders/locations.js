

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Locations', [{
      id: 'cjee22lsq0000cqxs5tmmpf1g',
      name: 'Quiet Room',
      centre: 'Nairobi',
      country: 'Kenya',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      id: 'cjee241h20000g7xsfzd572sl',
      name: 'Cafeteria',
      centre: 'Nairobi',
      country: 'Kenya',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      id: 'cjee24cz40000guxs6bdner6l',
      name: 'Block A 1st Floor',
      centre: 'Nairobi',
      country: 'Kenya',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cjee24n0n0000hfxsefer9tjh',
      name: 'Block A 2nd Floor',
      centre: 'Nairobi',
      country: 'Kenya',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      id: 'cjee24xnn0000i2xsh9qauyn5',
      name: 'Tsavo',
      centre: 'Nairobi',
      country: 'Kenya',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      id: 'cjee256gt0000ioxs69v4870x',
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
