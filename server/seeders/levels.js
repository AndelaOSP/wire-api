module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Levels', [{
      id: 1,
      name: 'Red',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      id: 2,
      name: 'Yellow',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Green',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    }]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Levels', null);
  }
};
