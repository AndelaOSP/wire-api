const { witnesses } = require('../utils/data/witnesses.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Witnesses', witnesses);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Witnesses', null);
  },
};
