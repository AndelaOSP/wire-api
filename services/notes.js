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

/**
 * Create a reply for an incident
 */
async function createReply(noteId, text) {
  return Knex('note_reply')
  .insert(Object.assign({}, { note_id: noteId }, text ));
}

/**
 * Get a list of all replies for a note
 * @param {*} noteId 
 */

const column = [
  'text',
  'note_reply.date_created',
  'user.id as user_id',
  'user.name as user_name'
];
async function getReplies(noteId) {
  return Knex('note_reply')
    .select(...column)
    .join('note', 'note_reply.note_id', 'note.id')
    .join('user', 'note_reply.user_id', 'user.id')
}

module.exports = {
  createNote,
  getNotes,
  createReply,
  getReplies
};
