const Knex = require('../models/incidents');

/**
 * Creating a incident entry
 */
async function createIncident(payload, userId) {
  return Knex('incidents')
    .insert(Object.assign({}, payload, { user_id: userId }));
}

const columns = [
  'description',
  'categories.name as category_name',
  'locations.name as location_name',
  'statuses.status as status',
  'date_created',
  'date_occurred',
  'users.username as user_name',
  'user.id as user_id',
];

async function viewOneIncident(id) {
  return Knex('incidents')
    .select(...columns)
    .join('categories', 'incidents.category_id', 'category.id')
    .leftJoin('locations', 'incidents.location_id', 'location.id')
    .join('statuses', 'incidents.status_id', 'incident_status.id')
    .join('users', 'incidents.user_id', 'user.id')
    .where({ 'incidents.id': id });
}

async function viewIncidents() {
  return Knex('incidents')
    .select(...columns).from('incident')
    .join('categories', 'incidents.category_id', 'category.id')
    .leftJoin('locations', 'incidents.location_id', 'location.id')
    .join('statuses', 'incidents.status_id', 'status.id')
    .join('users', 'incidents.user_id', 'user.id')
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

module.exports = {
  createIncident,
  viewOneIncident,
  viewIncidents,
  updateIncident,
  addSentiment,
  getSentiments,
};
