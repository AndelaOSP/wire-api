const incidents = require('./incidents');
const locations = require('./locations');
const notes = require('./notes');
const categories = require('./categories');
const users = require('./users');
const roles = require('./roles');
const slackEvents = require('./chats/slackEvents');
const appChats = require('./chats/appChats');
const { catchErrors } = require('./errorLogs');

module.exports = {
  incidents,
  locations,
  notes,
  categories,
  users,
  roles,
  slackEvents,
  appChats,
  catchErrors,
};
