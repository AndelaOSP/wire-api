const incidents = require('../utils/data/incidents.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Incidents', incidents.incidents);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Incidents', null);
  },
};
