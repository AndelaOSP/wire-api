const Incident = require('../models').Incidents;
const User = require('../models').Users;
const Location = require('../models').Locations;
const Level = require('../models').Levels;
const Status = require('../models').Statuses;
const AssigneeModel = require('../models').assigneeIncidents;
const generateAssigneeOrCcdEmailBody = require('../helpers/generateAssigneeOrCcdEmailBody');
const emailHelper = require('../helpers/emailHelper');
const {
  handleCCUpdateNotification,
  handleStatusUpdateNotification,
} = require('./notificationHelper');

let userAttributes = ['username', 'slackId', 'imageUrl', 'email'];

const returnIncidentsIncludes = () => {
  return [
    { model: Level, attributes: ['name'] },
    { model: Status, attributes: ['status'] },
    { model: Location, attributes: ['name', 'centre', 'country'] },
    {
      model: User,
      as: 'assignees',
      userAttributes,
      through: { attributes: ['assignedRole'] },
    },
    {
      model: User,
      as: 'reporter',
      userAttributes,
      through: { attributes: [] },
    },
    {
      model: User,
      as: 'witnesses',
      userAttributes,
      through: { attributes: [] },
    },
  ];
};

const findIncidentById = async id => {
  const include = returnIncidentsIncludes();

  const incident = await Incident.findById(id, { include });

  return incident;
};

/**
 * @function getUserDetails
 * @param payload object
 * @return userDetails object
 */
const getUserDetails = async payload => {
  const userDetails = await User.findById(payload.userId);

  userDetails.dataValues.incidentId = payload.incidentId;

  return userDetails;
};

/**
 * @function sendAssigneeOrCcdEmail
 * @param payload object
 * @return error or success message
 */

const sendAssigneeOrCcdEmail = async payload => {
  const userDetails = await getUserDetails(payload);

  const emailBody = await generateAssigneeOrCcdEmailBody({
    ...userDetails.dataValues,
    tagger: payload.tagger,
    assignedRole: payload.assignedRole, // add assigned role
  });

  emailHelper.sendMail(emailBody, error => {
    if (error) {
      return error;
    }

    return { message: 'The email was sent successfully' };
  });
};

/**
 * @function addAssignee
 * @param assignedUser object
 * @param incident object
 * @param res object
 * @return data and success message
 */
const addAssignee = async ({ assignedUser, incident, res }) => {
  const assignee = await User.findById(assignedUser.userId);

  assignedUser.assignedRole = 'assignee';

  await sendAssigneeOrCcdEmail(assignedUser);

  assignee.assigneeIncidents = {
    assignedRole: 'assignee',
  };
  await incident.addAssignee(assignee);
  const data = await findIncidentById(incident.id, res);
  return res.status(200).send({ data, status: 'success' });
};

/**
 * @function addCcdUser
 * @param ccdUser object
 * @param res object
 * @param incident object
 * @return data and success message
 */
const addCcdUser = async ({ ccdUser, res, incident, tagger }) => {
  const ccdPromises = ccdUser.map(async user => {
    const ccd = await User.findById(user.userId);

    let currentCcd = { ...user, assignedRole: 'ccd', tagger };

    await sendAssigneeOrCcdEmail(currentCcd);

    ccd.assigneeIncidents = {
      assignedRole: 'ccd',
    };

    return incident.addAssignee(ccd);
  });

  await Promise.all(ccdPromises);

  const data = await findIncidentById(incident.id, res);

  return res.status(200).send({ data, status: 'success' });
};

/**
 * @function mapAssignees
 * @param incident object
 * @return assignee incident
 */
const mapAssignees = incident => {
  return incident.map(oneIncident => {
    oneIncident.dataValues.assignedRole =
      oneIncident.dataValues.assigneeIncidents.assignedRole;
    delete oneIncident.dataValues.assigneeIncidents;
    return oneIncident;
  });
};

/**
 * @function mapIncidents
 * @param incidents
 * @return incident
 */
const mapIncidents = incidents => {
  return incidents.map(incident => {
    incident.assignees && mapAssignees(incident.assignees);
    [incident.dataValues.reporter] = incident.dataValues.reporter;
    return incident;
  });
};

const getUserOptions = (assignedUser, ccdUser, res) => {
  return {
    assignedUser: {
      assignedRole: 'assignee',
      action: addAssignee,
      arguments: { assignedUser },
    },
    ccdUser: {
      assignedRole: 'ccd',
      action: addCcdUser,
      arguments: { ccdUser, tagger: res.locals.currentUser.username },
    },
  };
};

const updateAssignedOrCcdUser = async (
  assignedUser,
  ccdUser,
  incident,
  req,
  res
) => {
  const userKey = assignedUser ? 'assignedUser' : 'ccdUser';
  const users = getUserOptions(assignedUser, ccdUser, res);
  const selectedUser = users[userKey];
  if (incident.dataValues.assignees.length === 0)
    return selectedUser.action({ ...selectedUser.arguments, incident, res });
  await AssigneeModel.destroy({
    where: {
      assignedRole: selectedUser.assignedRole,
      incidentId: incident.id,
    },
  });
  if (ccdUser) {
    await handleCCUpdateNotification(req, ccdUser, incident.id, '');
  }
  return selectedUser.action({ ...selectedUser.arguments, incident, res });
};

const updateIncident = async (incident, req, res) => {
  let { assignee: assignedUser, ccd: ccdUser, statusId: status } = req.body;

  if (assignedUser || ccdUser) {
    return updateAssignedOrCcdUser(assignedUser, ccdUser, incident, req, res);
  }
  await incident.update({
    statusId: req.body.statusId || incident.statusId,
    categoryId: req.body.categoryId || incident.categoryId,
    levelId: req.body.levelId || incident.levelId,
  });
  if (status) {
    await handleStatusUpdateNotification(req, incident.assignees, incident.id);
  }
  return res.status(200).send({ data: incident, status: 'success' });
};

module.exports = {
  addAssignee,
  addCcdUser,
  findIncidentById,
  mapAssignees,
  mapIncidents,
  updateIncident,
  returnIncidentsIncludes,
  updateAssignedOrCcdUser,
};
