const Knex = require('../models/notes');
// const Knex = require('../models/replies');

/**
 * Create a note for an incident
 */
async function createNote(incidentId, notes) {
  return Knex('notes')
    .insert({ incident_id: incidentId, notes });
}

/**
 * Get a list of all notes for an incidence
 * @param {*} incidentId 
 */

const columns = [
  'note',
  'notes.date_created',
  'users.username as user_name',
  'users.id as user_id'
];
async function getNotes(incidentId) {
  return Knex('notes')
    .select(...columns)
    .join('incidents', 'notes.incident_id', 'incident.id')
    .join('users', 'incidents.user_id', 'user.id')
}

/**
 * Create a reply for an incident
 */
async function createReply(noteId, text) {
  return Knex('replies')
  .insert(Object.assign({}, { note_id: noteId }, text ));
}

/**
 * Get a list of all replies for a note
 * @param {*} noteId 
 */

const column = [
  'reply',
  'replies.date_created',
  'users.id as user_id',
  'users.username as user_name'
];
async function getReplies(noteId) {
  return Knex('replies')
    .select(...column)
    .join('notes', 'replies.note_id', 'note.id')
    .join('users', 'replies.user_id', 'user.id')
}

module.exports = {
  createNote,
  getNotes,
  createReply,
  getReplies
};
