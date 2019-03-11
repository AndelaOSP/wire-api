const locations = require('../utils/data/locations.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Locations', locations.locations);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Locations', null);
  },
};
