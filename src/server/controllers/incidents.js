const Incident = require('../models').Incidents;
const User = require('../models').Users;
const { findOrCreateLocation } = require('../helpers/locationHelper');
const findOrCreateUser = require('../helpers/findOrCreateUser');
const listAssigneeIncidentsIncludes = require('../helpers/listAssigneeIncidentsIncludes');
const {
  findIncidentById,
  mapAssignees,
  mapIncidents,
  returnIncidentsIncludes,
  updateIncident,
} = require('../helpers/incidentHelper');
const deleteFromResponseLocals = require('../helpers/deleteFromResponseLocals');

const include = returnIncidentsIncludes();

module.exports = {
  // create an incident
  create: async (req, res) => {
    let {
      location,
      witnesses,
      incidentReporter,
      dateOccurred,
      description,
      subject,
      categoryId,
      statusId,
      levelId,
    } = req.body;
    const { reporterLocation } = incidentReporter;
    let [dd, mm, yy] = dateOccurred.split('-');
    dateOccurred = `${mm}-${dd}-${yy}`;

    const foundLocation = await findOrCreateLocation(location, res);
    const locationId = foundLocation.dataValues.id;
    const incident = await Incident.create({
      description,
      subject,
      dateOccurred,
      categoryId,
      statusId: statusId || 1,
      locationId,
      levelId: levelId || 3,
    });

    const user = await User.findOne({
      where: { email: incidentReporter.email },
    });

    let createdReporter;

    if (user) {
      createdReporter = await user.update({
        slackId: incidentReporter.slackId,
      });
    } else {
      [createdReporter] = await findOrCreateUser(
        incidentReporter,
        reporterLocation,
        res
      );
    }

    await incident.addReporter(createdReporter);

    const witnessCreationPromises = witnesses.map(witness => {
      let { witnessLocation } = witness;

      return findOrCreateUser(witness, witnessLocation);
    });

    const createdWitnesses = await Promise.all(witnessCreationPromises);

    if (createdWitnesses.length > 0) {
      const addedWitnessesPromises = createdWitnesses.map(mappedWitness => {
        return incident.addWitness(mappedWitness[0]);
      });

      await Promise.all(addedWitnessesPromises);
    }

    const data = await findIncidentById(incident.id, res);

    return res.status(201).send({ data, status: 'success' });
  },

  // get all incidents
  list: async (req, res) => {
    if (res.locals.currentUser.roleId === 2) {
      const includeForAssignee = listAssigneeIncidentsIncludes();

      const findIncidents = await User.findOne({
        where: { id: res.locals.currentUser.id },
        include: includeForAssignee,
      });

      const userAssignedIncidents = findIncidents.assignedIncidents;
      const mappedIncidents = mapIncidents(userAssignedIncidents);

      return res
        .status(200)
        .send({ data: { incidents: mappedIncidents }, status: 'success' });
    }

    const incidents = await Incident.findAll({ include });

    const mappedIncidents = mapIncidents(incidents);

    return res
      .status(200)
      .send({ data: { incidents: mappedIncidents }, status: 'success' });
  },

  // retrieve an incident by ID
  findById: async (req, res) => {
    const incident = await findIncidentById(req.params.id, res);
    incident.assignees = mapAssignees(incident.assignees);
    [incident.dataValues.reporter] = incident.dataValues.reporter;

    return res.status(200).send({ data: incident, status: 'success' });
  },

  // update an incident
  update: async (req, res) => {
    const incident = await Incident.findById(req.params.id, {
      include,
    });

    return updateIncident(incident, req, res);
  },

  // delete an incident by ID. To be refactored into archive incidents that are old and resolved.
  delete: (req, res) => {
    deleteFromResponseLocals(req, res, 'incident');
  },

  //search an incident by subject or description.
  search: async (req, res) => {
    if (!req.query.q) {
      return res.status(400).send({ message: 'please provide query' });
    }

    const incidents = await Incident.findAll({
      include,
      where: {
        $or: [
          { subject: { $ilike: `%${req.query.q}%` } },
          { description: { $ilike: `%${req.query.q}%` } },
        ],
      },
    });

    return res.status(200).send({ data: { incidents }, status: 'success' });
  },

  // filter incidents by category
  listIncidents: async (req, res) => {
    const incidents = await Incident.findAll({
      where: { categoryId: req.params.id },
      include,
    });

    return res.status(200).send({ data: { incidents }, status: 'success' });
  },
};
