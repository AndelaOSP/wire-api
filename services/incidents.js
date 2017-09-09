const Knex = require('../db');

/**
 * Creating a incident entry
 */
async function createIncident(payload, userId) {
  return Knex('incident')
    .insert(Object.assign({}, payload, { user_id: userId }));
}
const columns = [
  'description',
  'incident_category.name as category_name',
  'location.name as location_name',
  'incident_status.status as status',
  'date_created',
  'date_occurred',
  'user.name as user_name',
  'user.id as user_id',
];

async function viewOneIncident(id) {
  return Knex('incident')
    .select(...columns)
    .join('incident_category', 'incident.category_id', 'incident_category.id')
    .leftJoin('location', 'incident.location_id', 'location.id')
    .join('incident_status', 'incident.status_id', 'incident_status.id')
    .join('user', 'incident.user_id', 'user.id')
    .where({ 'incident.id': id });
}
async function viewIncidents() {
  return Knex('incidents')
    .select(...columns).from('incident')
    .join('incident_category', 'incident.category_id', 'incident_category.id')
    .leftJoin('location', 'incident.location_id', 'location.id')
    .join('incident_status', 'incident.status_id', 'incident_status.id')
    .join('user', 'incident.user_id', 'user.id')
}

async function updateIncident(payload, incidentId) {
  return Knex('incident')
    .update(Object.assign({}, payload, { id: incidentId }))
    .where('id', incidentId);
}

module.exports = {
  createIncident,
  viewOneIncident,
  viewIncidents,
  updateIncident,
};
