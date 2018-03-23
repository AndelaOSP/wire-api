

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Levels', [{
      name: 'Red',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Yellow',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'Green',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    }]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Levels', null);
  }
};
