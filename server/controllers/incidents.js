const Incident = require('../models').Incidents;
const User = require('../models').Users;
const AssigneeModel = require('../models').assigneeIncidents;
const { findOrCreateLocation } = require('../helpers/locationHelper');
const findOrCreateUser = require('../helpers/findOrCreateUser');
const listAssigneeIncidentsIncludes = require('../helpers/listAssigneeIncidentsIncludes');
const {
  addAssignee,
  addCcdUser,
  findIncidentById,
  mapAssignees,
  mapIncidents,
  returnIncidentsIncludes,
} = require('../helpers/incidentHelper');

const include = returnIncidentsIncludes();

module.exports = {
  // create an incident
  create(req, res) {
    let { location } = req.body;
    let { witnesses } = req.body;
    let { reporterLocation } = req.body.incidentReporter;
    let { incidentReporter } = req.body;
    let { dateOccurred } = req.body;
    let createdIncident;
    let [dd, mm, yy] = req.body.dateOccurred.split('-');
    dateOccurred = `${mm}-${dd}-${yy}`;
    return findOrCreateLocation(location, res)
      .then(location => {
        return location.dataValues.id;
      })
      .then(locationId => {
        return Incident.create({
          description: req.body.description,
          subject: req.body.subject,
          dateOccurred,
          categoryId: req.body.categoryId,
          statusId: req.body.statusId || 1,
          locationId,
          levelId: req.body.levelId || 3,
        });
      })
      .then(incident => {
        createdIncident = incident;
        return User.findOne({
          where: {
            email: incidentReporter.email,
          },
        })
          .then(user => {
            if (user) {
              return user.update({ slackId: incidentReporter.slackId });
            }
            return findOrCreateUser(incidentReporter, reporterLocation, res);
          })
          .catch(error => {
            return error;
          });
      })
      .then(createdReporter => {
        createdIncident.addReporter(createdReporter);
      })
      .then(() => {
        let witnessCreationPromises = [];
        if (witnesses && witnesses.length > 0) {
          for (let i = 0; i < witnesses.length; i++) {
            let { witnessLocation } = req.body.witnesses[i];
            for (let k = 0; k < witnessLocation.length; k++) {
              witnessLocation = witnessLocation[k];
            }
            let witness = witnesses[i];
            let witnessCreationPromise = findOrCreateUser(
              witness,
              witnessLocation,
            );
            witnessCreationPromises.push(witnessCreationPromise);
          }
        }
        return Promise.all(witnessCreationPromises);
      })
      .then(createdWitnesses => {
        let addedWitnessesPromises = [];
        if (createdWitnesses.length > 0) {
          let mappedWitnesses = createdWitnesses.map(witness => {
            return witness[0];
          });
          for (let i = 0; i < mappedWitnesses.length; i++) {
            addedWitnessesPromises.push(
              createdIncident.addWitness(mappedWitnesses[i]),
            );
          }
        }
        return Promise.all(addedWitnessesPromises);
      })
      .then(() => {
        return findIncidentById(createdIncident.id, res);
      })
      .then(data => {
        res.status(201).send({ data, status: 'success' });
      });
  },

  // get all incidents
  async list(req, res) {
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
    return Incident.findAll({
      include,
    }).then(incidents => {
      const mappedIncidents = mapIncidents(incidents);
      return res
        .status(200)
        .send({ data: { incidents: mappedIncidents }, status: 'success' });
    });
  },

  // retrieve an incident by ID
  findById(req, res) {
    return findIncidentById(req.params.id, res).then(incident => {
      incident.assignees && mapAssignees(incident.assignees);
      [incident.dataValues.reporter] = incident.dataValues.reporter;
      return res.status(200).send({ data: incident, status: 'success' });
    });
  },

  // update an incident
  update(req, res) {
    let { assignee: assignedUser, ccd: ccdUser } = req.body;

    let findIncidentPromise = Incident.findById(req.params.id, {
      include,
    }).then(incident => {
      return incident
        ? Promise.resolve(incident)
        : Promise.reject({ message: 'Incident not found', status: 'fail' });
    });

    if (assignedUser || ccdUser) {
      const userKey = assignedUser ? 'assignedUser' : 'ccdUser';

      const users = {
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

      const selectedUser = users[userKey];

      return findIncidentPromise.then(incident => {
        if (incident.dataValues.assignees.length === 0) {
          return selectedUser.action({
            ...selectedUser.arguments,
            incident,
            res,
          });
        } else {
          return AssigneeModel.destroy({
            where: {
              assignedRole: selectedUser.assignedRole,
              incidentId: incident.id,
            },
          }).then(() => {
            return selectedUser.action({
              ...selectedUser.arguments,
              incident,
              res,
            });
          });
        }
      });
    } else {
      return findIncidentPromise.then(incident => {
        return incident
          .update({
            statusId: req.body.statusId || incident.statusId,
            categoryId: req.body.categoryId || incident.categoryId,
            levelId: req.body.levelId || incident.levelId,
          })
          .then(() => {
            return findIncidentById(incident.id, res);
          })
          .then(data => {
            return res.status(200).send({ data, status: 'success' });
          });
      });
    }
  },

  // delete an incident by ID. To be refactored into archive incidents that are old and resolved.
  delete(req, res) {
    return res.locals.incident.destroy().then(() => res.status(204).send());
  },

  //search an incident by subject or description.
  search(req, res) {
    if (!req.query.q) {
      return res.status(400).send({ message: 'please provide query' });
    }
    return Incident.findAll({
      include,
      where: {
        $or: [
          { subject: { $ilike: `%${req.query.q}%` } },
          { description: { $ilike: `%${req.query.q}%` } },
        ],
      },
    }).then(incidents => {
      res.status(200).send({ data: { incidents }, status: 'success' });
    });
  },

  // filter incidents by category
  listIncidents(req, res) {
    return Incident.findAll({
      where: {
        categoryId: req.params.id,
      },
      include,
    }).then(incidents => {
      res.status(200).send({ data: { incidents }, status: 'success' });
    });
  },
};
