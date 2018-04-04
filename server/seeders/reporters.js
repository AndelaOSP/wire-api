module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('userIncidents', [{
      incidentId: 'cjfkubrlv0001tgxs3mre',
      userId: 'U7LHY6W4B',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      incidentId: 'cjfkubrlv0001tgxs3',
      userId: 'U7LEPG8LF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      incidentId: 'cjfkubrlv0001tsjksuis3',
      userId: 'U7LEPG8LF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    ]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('userIncidents', null);
  }
};
