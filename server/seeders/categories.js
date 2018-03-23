

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categories', [{
      name: 'Frequent office absence without authorization',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Use of abusive language',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Theft',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Fraud',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Workplace injury e.g. Burns, fatal injuries',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Violence at the workplace or intimidation',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Self-inflicted harm',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Intoxication during working hours',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Supply, use or possession of illicit drugs',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Insubordination',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Serious infringement of Health and Safety Rules',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Deliberate damage of company property',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Providing confidential Company information to competitors or unauthorised bodies',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Unauthorised use/sell of Company property, facilities, or resources',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Any form of discrimination',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Bullying',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Aggressive and/or intimidating behaviour',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Any form of harassment',
      visible: true,
      levelId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Bad attitude towards colleagues',
      visible: false,
      levelId: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Taking extended leave days without prior notification and approval the Line manager',
      visible: false,
      levelId: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Excessive tardiness',
      visible: false,
      levelId: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Disrespect of colleagues space and/or beliefs',
      visible: false,
      levelId: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Not following the laid down procedures',
      visible: false,
      levelId: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    {
      name: 'Improper use of work tools and equipments',
      visible: false,
      levelId: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    },
    ]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Categories', null);
  }
};
