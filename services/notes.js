const Knex = require('../db');

/**
 * Create a note for an incident
 */
async function createNote(incidentId, note) {
  return Knex('note')
    .insert({ incident_id: incidentId, note });
}

/**
 * Get a list of all notes for an incidence
 * @param {*} incidentId 
 */

const columns = [
  'note',
  'note.date_created',
  'user.name as user_name',
  'user.id as user_id'
];
async function getNotes(incidentId) {
  return Knex('note')
    .select(...columns)
    .join('incident', 'note.incident_id', 'incident.id')
    .join('user', 'incident.user_id', 'user.id')
}

module.exports = {
  createNote,
  getNotes,
};
