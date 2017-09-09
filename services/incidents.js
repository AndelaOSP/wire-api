const Knex = require('../db');

/**
 * Creating a incident entry
 */
async function createIncident(payload, userId) {
  return Knex('incident')
    .insert(Object.assign({}, payload, { user_id: userId }));
}

async function updateIncident(payload, incidentId) {
  return Knex('incident')
    .update(Object.assign({}, payload, { id: incidentId }))
    .where('id', incidentId);
}

module.exports = {
  createIncident, updateIncident
}
