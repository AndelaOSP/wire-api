module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Statuses', [
      {
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        status: 'In Progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        status: 'Resolved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Statuses', null);
  },
};
