module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles', [{
      name: 'User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Admin',
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
