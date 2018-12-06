const validateIncidentPayload = require('./incidents/validateIncidentPayload');
const validateIncidentId = require('./incidents/validateIncidentId');
const validateUserPayload = require('./users/validateUserPayload');
const validateUserId = require('./users/validateUserId');
const validateNotePayload = require('./notes/validateNotePayload');
const validateNoteId = require('./notes/validateNoteId');

module.exports = {
  validateIncidentPayload,
  validateIncidentId,
  validateUserPayload,
  validateUserId,
  validateNotePayload,
  validateNoteId,
};
