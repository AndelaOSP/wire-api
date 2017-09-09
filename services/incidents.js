const Knex = require('../db');

/**
 * Creating a incident entry
 */
async function createIncident(payload, userId) {
  return Knex('incident')
    .insert(Object.assign({}, payload, { user_id: userId }));
}

module.exports = {
  createIncident,
}
