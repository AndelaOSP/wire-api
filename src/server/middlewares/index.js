const validateIncidentPayload = require('./incidents/validateIncidentPayload')
  .validateNewIncidentBody;
const validateIncidentUpdatePayload = require('./incidents/validateIncidentPayload')
  .validateUpdateIncidentBody;
const validateIncidentId = require('./incidents/validateIncidentId');
const validateUserPayload = require('./users/validateUserPayload')
  .validateNewUserBody;
const validateUpdateBody = require('./users/validateUserPayload')
  .validateUpdateUserBody;
const validateUserId = require('./users/validateUserId');
const validateNotePayload = require('./notes/validateNotePayload');
const validateNoteId = require('./notes/validateNoteId');
const slackUserRequest = require('./slack/getUsers');


module.exports = {
  validateIncidentPayload,
  validateIncidentUpdatePayload,
  validateIncidentId,
  validateUserPayload,
  validateUpdateBody,
  validateUserId,
  validateNotePayload,
  validateNoteId,
  slackUserRequest
};
