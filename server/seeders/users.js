

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        id: 'U7LEPG8LF',
        email: 'batian.muthoga@andela.com',
        username: 'Batian Muthoga',
        imageUrl: 'https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png',
        roleId: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString() 
      },
      {
        id: 'U7LHY6W4B',
        email: 'mercy.muchai@andela.com',
        username: 'Mercy Muchai',
        imageUrl: 'https://secure.gravatar.com/avatar/cf493cf28e96f654602b2f71e4d655e2.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0003-48.png',
        roleId: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString() 
      },
    ]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null);
  }
};
