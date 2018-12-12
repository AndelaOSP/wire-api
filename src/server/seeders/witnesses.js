module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Witnesses', [
      {
        incidentId: 'cjfkubrlv0001tgxs3mre',
        userId: 'cjl6efcka00004tny9ilz7b61',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        incidentId: 'cjfkubrlv0001tsjksuis3',
        userId: 'cjl6ege6e000053nyv67otq7a',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Witnesses', null);
  },
};
