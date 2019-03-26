const { reporters } = require('../utils/data/reporters.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('userIncidents', reporters);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('userIncidents', null);
  },
};
