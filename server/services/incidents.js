const Knex = require('../models/incidents');

/**
 * Creating a incident entry
 */
async function createIncident(payload, userId) {
  return Knex('incidents')
    .insert(Object.assign({}, payload, { user_id: userId }));
}

const columns = [
  'incident.id',
  'description',
  'categories.name as category_name',
  'locations.name as location_name',
  'statuses.status as status',
  'date_created',
  'date_occurred',
  'users.username as user_name',
  'user.id as user_id',
];

async function getIncident(id) {
  return Knex('incident')
    .select(...columns)
    .join('incident_category', 'incident.category_id', 'incident_category.id')
    .leftJoin('location', 'incident.location_id', 'location.id')
    .leftJoin('incident_status', 'incident.status_id', 'incident_status.id')
    .join('user', 'incident.user_id', 'user.id')
    .where({ 'incident.id': id });
}

async function getIncidents() {
  return Knex('incident')
    .select(...columns)
    .join('incident_category', 'incident.category_id', 'incident_category.id')
    .leftJoin('location', 'incident.location_id', 'location.id')
    .leftJoin('incident_status', 'incident.status_id', 'incident_status.id')
    .join('user', 'incident.user_id', 'user.id')
    .orderBy('incident.id', 'DESC');
}

async function addSentiment(incidentId, sentimentId, userId) {
  // if there was previous rating, should beoverwriten
  const [ previous ] = await Knex('incident_sentiment')
    .where({ incident_id: incidentId, user_id: userId });
  if (previous) {
    // update instead
    const update = await Knex('incident_sentiment')
      .update({ sentiment_id: sentimentId })
      .where({ incident_id: incidentId, user_id: userId });
    return [ previous.id ];
  }
  return Knex('incident_sentiment')
    .insert({ incident_id: incidentId, sentiment_id: sentimentId, user_id: userId });
}

async function updateIncident(payload, incidentId) {
  return Knex('incident')
    .update(Object.assign({}, payload, { id: incidentId }))
    .where('id', incidentId);
}

/**
 * Gets a list of sentiments on a particular incident
 * @param {*} incidentId 
 */
async function getSentiments(incidentId) {
  return Knex('incident_sentiment')
    .select('*')
    .join('sentiment', 'incident_sentiment.sentiment_id', 'sentiment.id')
    .join('users', 'incident_sentiment.user_id', 'user.id')
    .where('incident_id', incidentId);
}

/**
 * Get list of all locations
 */
async function getLocations() {
  return Knex('location');
}

/**
 * Get list of incident category levels
 */
async function getLevels() {
  return Knex('incident_level');
}

/**
 * Create incident category
 */
async function createIncidentCategory(payload) {
  return Knex('incident_category').insert(payload);
}

/**
 * GEt list of incident categories
 */
async function getIncidentCategories() {
  return Knex('incident_category')
    .select(...[
      'incident_category.id',
      'incident_category.name',
      'incident_level.name as level_name',
      'incident_level.id as level_id',
      'incident_category.visible',
    ])
    .join('incident_level', 'incident_category.level_id', 'incident_level.id');
}

module.exports = {
  createIncident,
  getIncident,
  getIncidents,
  updateIncident,
  addSentiment,
  getSentiments,
  getLocations,
  getLevels,
  createIncidentCategory,
  getIncidentCategories,
};