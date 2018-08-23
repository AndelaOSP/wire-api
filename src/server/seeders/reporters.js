module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('userIncidents', [{
      incidentId: 'cjfkubrlv0001tgxs3mre',
      userId: 'cjl6ege6e000053nyv67otq7a',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      incidentId: 'cjfkubrlv0001tgxs3',
      userId: 'cjl6efcka00004tny9ilz7b61',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      incidentId: 'cjfkubrlv0001tsjksuis3',
      userId: 'cjl6efcka00004tny9ilz7b61',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    ]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('userIncidents', null);
  }
};
