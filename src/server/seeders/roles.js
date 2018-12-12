module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Roles', [
      {
        name: 'User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'Assignee',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Roles', null);
  },
};
