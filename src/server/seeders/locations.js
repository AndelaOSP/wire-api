const locations = require('../utils/data/locations');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Locations', locations);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Locations', null);
  },
};
