const validateIncidentPayload = require('./incidents/validateIncidentPayload');
const validateIncidentId = require('./incidents/validateIncidentId');
const validateUserPayload = require('./users/validateUserPayload').validateNewUserBody;
const validateUpdateBody = require('./users/validateUserPayload').validateUpdateUserBody;
const validateUserId = require('./users/validateUserId');
const validateNotePayload = require('./notes/validateNotePayload');
const validateNoteId = require('./notes/validateNoteId');
const validateChatPayload = require('./chats/validateChatPayload');

module.exports = {
  validateIncidentPayload,
  validateIncidentId,
  validateUserPayload,
  validateUpdateBody,
  validateUserId,
  validateNotePayload,
  validateNoteId, validateChatPayload,
};
