const incidents = require('../utils/data/incidents');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Incidents', incidents);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Incidents', null);
  },
};
