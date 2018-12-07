const Incident = require('../models').Incidents;
const User = require('../models').Users;
const Location = require('../models').Locations;
const Level = require('../models').Levels;
const Status = require('../models').Statuses;

let userAttributes = ['username', 'slackId', 'imageUrl', 'email'];
const listAssigneeIncidentsIncludes = () => {
  const include = [
    {
      model: Incident,
      as: 'assignedIncidents',
      attributes: ['id', 'description', 'subject', 'dateOccurred'],
      through: {
        attributes: [],
      },
      include: [
        {
          model: Status,
          attributes: ['status'],
        },
        {
          model: Level,
          attributes: ['name'],
        },
        {
          model: Location,
          attributes: ['name', 'centre', 'country'],
        },
        {
          model: User,
          as: 'assignees',
          userAttributes,
          through: {
            attributes: ['assignedRole'],
          },
        },
        {
          model: User,
          as: 'reporter',
          userAttributes,
        },
        {
          model: User,
          as: 'witnesses',
          userAttributes,
        },
      ],
    },
  ];
  return include;
};

module.exports = listAssigneeIncidentsIncludes;
