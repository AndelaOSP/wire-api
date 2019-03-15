const { userGroups } = require('../utils/data/user-groups.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('UserGroups', userGroups);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('UserGroups', null);
  },
};
