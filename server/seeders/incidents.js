module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Incidents', [{
      id: 'cjfkubrlv0001tgxs3mre',
      subject: 'Abusive Language',
      description: 'Someone said some things to me I cannot even type',
      dateOccurred: '12-10-2017',
      levelId: '1',
      statusId: '2',
      categoryId: '2',
      locationId: 'cjee256gt0000ioxs69v4870x',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      id: 'cjfkubrlv0001tgxs3',
      subject: 'Theft',
      description: 'Someone picked up my phone from the table',
      dateOccurred: '3-1-2018',
      levelId: '2',
      statusId: '1',
      categoryId: '3',
      locationId: 'cjee24n0n0000hfxsefer9tjh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      id: 'cjfkubrlv0001tsjksuis3',
      subject: 'Discrimination',
      description: 'Someone said something that was discriminative to my gender',
      dateOccurred: '2-3-2018',
      levelId: '3',
      statusId: '3',
      categoryId: '15',
      locationId: 'cjee241h20000g7xsfzd572sl',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    }
    ]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Incidents', null);
  }
};
