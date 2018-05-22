module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Witnesses', [{
      incidentId: 'cjfkubrlv0001tgxs3mre',
      userId: 'U7LEPG8LF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      incidentId: 'cjfkubrlv0001tsjksuis3',
      userId: 'U7LHY6W4B',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    ]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Witnesses', null);
  }
};
