module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [
      {
        id: 'cjl6efcka00004tny9ilz7b61',
        slackId: 'U7LEPG8LF',
        email: 'batian.muthoga@andela.com',
        username: 'Batian Muthoga',
        imageUrl:
          'https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png',
        roleId: 2,
        locationId: 'cjee24xnn0000i2xsh9qauyn5',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cjl6ege6e000053nyv67otq7a',
        slackId: 'U7LHY6W4B',
        email: 'mercy.muchai@andela.com',
        username: 'Mercy Muchai',
        imageUrl:
          'https://secure.gravatar.com/avatar/cf493cf28e96f654602b2f71e4d655e2.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0003-48.png',
        roleId: 2,
        locationId: 'cjee24xnn0000i2xsh9qauyn5',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cjl6egyei00005dnytqp4a06l',
        slackId: 'U7LHY6T4B',
        email: 'eugene.omar@andela.com',
        username: 'Eugene Omar',
        imageUrl:
          'https://ca.slack-edge.com/T02R3LKBA-U4GHQF7BQ-89b22f3000e2-48',
        roleId: 3,
        locationId: 'cjee24xnn0000i2xsh9qauyn5',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cjl6efcka00004tny9ilz7b66',
        slackId: 'U7LEPG8LF',
        email: 'batian.sss@andela.com',
        username: 'Batian Sss',
        imageUrl:
          'https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png',
        roleId: 1,
        locationId: 'cjee24xnn0000i2xsh9qauyn5',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Users', null);
  },
};
