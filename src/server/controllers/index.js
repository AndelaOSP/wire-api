const incidents = require('./incidents');
const locations = require('./locations');
const notes = require('./notes');
const categories = require('./categories');
const users = require('./users');
const roles = require('./roles');
const slackEvents = require('./chats/slackEvents');
const slackChannels = require('./slackChannels');
const { catchErrors } = require('./errorLogs');

module.exports = {
  incidents,
  locations,
  notes,
  categories,
  users,
  roles,
  slackEvents,
  slackChannels,
  catchErrors,
};
