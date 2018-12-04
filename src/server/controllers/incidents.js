const errorLogs = require('./errorLogs');
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
  returnIncidentsIncludes
} = require('../helpers/incidentHelper');

const include = returnIncidentsIncludes();

module.exports = {
  // create an incident
  create(req, res) {
    let location = req.body.location;
    let witnesses = req.body.witnesses;
    let reporterLocation = req.body.incidentReporter.reporterLocation;
    let incidentReporter = req.body.incidentReporter;
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
          levelId: req.body.levelId || 3
        });
      })
      .then(incident => {
        createdIncident = incident;
        return User.findOne({
          where: {
            email: incidentReporter.email
          }
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
            let witnessLocation = req.body.witnesses[i].witnessLocation;
            for (let k = 0; k < witnessLocation.length; k++) {
              witnessLocation = witnessLocation[k];
            }
            let witness = witnesses[i];
            let witnessCreationPromise = findOrCreateUser(
              witness,
              witnessLocation
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
              createdIncident.addWitness(mappedWitnesses[i])
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
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  },

  // get all incidents
  async list(req, res) {
    if (res.locals.currentUser.roleId === 2) {

      const includeForAssignee = listAssigneeIncidentsIncludes();
      const findIncidents = await User.findOne({
        where: { id: res.locals.currentUser.id },
        include: includeForAssignee
      });
      const userAssignedIncidents = findIncidents.assignedIncidents;
      const mappedIncidents = mapIncidents(userAssignedIncidents);
      return res
        .status(200)
        .send({ data: { incidents: mappedIncidents }, status: 'success' });
    }
    return Incident.findAll({
      include
    })
      .then(incidents => {
        const mappedIncidents = mapIncidents(incidents);
        return res
          .status(200)
          .send({ data: { incidents: mappedIncidents }, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        return res.status(400).send(error);
      });
  },

  // retrieve an incident by ID
  findById(req, res) {
    return findIncidentById(req.params.id, res)
      .then(incident => {
        if (!incident) {
          return res
            .status(404)
            .send({ message: 'Incident not found', status: 'fail' });
        }
        incident.assignees && mapAssignees(incident.assignees);
        incident.dataValues.reporter = incident.dataValues.reporter[0];
        return res.status(200).send({ data: incident, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        return res.status(400).send(error);
      });
  },

  // update an incident
  update(req, res) {
    let { assignee: assignedUser, ccd: ccdUser } = req.body;

    let findIncidentPromise = Incident.findById(req.params.id, {
      include
    }).then(incident => {
      return incident
        ? Promise.resolve(incident)
        : Promise.reject({
          message: 'Incident not found',
          status: 'fail'
        });
    });

    if (assignedUser || ccdUser) {
      const userKey = assignedUser ? 'assignedUser' : 'ccdUser';

      const users = { assignedUser: { assignedRole: 'assignee', action: addAssignee, arguments: { assignedUser } }, ccdUser: { assignedRole: 'ccd', action: addCcdUser, arguments: { ccdUser, tagger: res.locals.currentUser.username } } };

      const selectedUser = users[userKey];

      return findIncidentPromise
        .then(incident => {
          if (incident.dataValues.assignees.length === 0) {
            return selectedUser.action({
              ...selectedUser.arguments,
              incident,
              res
            });
          } else {
            return AssigneeModel.destroy({
              where: {
                assignedRole: selectedUser.assignedRole,
                incidentId: incident.id
              }
            }).then(() => {
              return selectedUser.action({
                ...selectedUser.arguments,
                incident,
                res
              });
            });
          }
        })
        .catch(error => {
          errorLogs.catchErrors(error);
          return res.status(400).send(error);
        });

    } else {
      return findIncidentPromise
        .then(incident => {
          return incident
            .update({
              statusId: req.body.statusId || incident.statusId,
              categoryId: req.body.categoryId || incident.categoryId,
              levelId: req.body.levelId || incident.levelId
            })
            .then(() => {
              return findIncidentById(incident.id, res);
            })
            .then(data => {
              return res.status(200).send({ data, status: 'success' });
            });
        })
        .catch(error => {
          errorLogs.catchErrors(error);
          return res.status(400).send(error);
        });
    }
  },

  // delete an incident by ID. To be refactored into archive incidents that are old and resolved.
  delete(req, res) {
    return Incident.findById(req.params.id).then(incident => {
      if (!incident) {
        return res.status(404).send({
          message: 'Incident not found',
          status: 'fail'
        });
      }
      return incident
        .destroy()
        .then(() => res.status(204).send())
        .catch(error => {
          errorLogs.catchErrors(error);
          res.status(400).send(error);
        });
    });
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
          { description: { $ilike: `%${req.query.q}%` } }
        ]
      }
    })
      .then(incident => {
        res
          .status(200)
          .send({ data: { incidents: incident }, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  },

  // filter incidents by category
  listIncidents(req, res) {
    return Incident.findAll({
      where: {
        categoryId: req.params.id
      },
      include
    })
      .then(incident => {
        res
          .status(200)
          .send({ data: { incidents: incident }, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  }
};
