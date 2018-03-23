

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        id: '-KhLsLqucbC1WAMylcFt',
        email: 'caroline.nkirote@andela.com',
        username: 'Caroline Nkirote',
        imageUrl: 'https://lh4.googleusercontent.com/-rVipu2W1sBk/AAAAAAAAAAI/AAAAAAAAACQ/rOgW25IUgb8/photo.jpg',
        roleId: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString() 
      },
      {
        id: '-KhLsOxrKcKZC8i2n888',
        email: 'mercy.muchai@andela.com',
        username: 'Mercy Muchai',
        imageUrl: 'https://lh3.googleusercontent.com/-XxYl2Ryrfns/AAAAAAAAAAI/AAAAAAAAABg/QJRPuQnerrk/photo.jpg',
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
