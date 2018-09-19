const errorLogs = require('./errorLogs');
const Incident = require('../models').Incidents;
const User = require('../models').Users;
const Location = require('../models').Locations;
const Level = require('../models').Levels;
const Status = require('../models').Statuses;
const AssigneeModel = require('../models').assigneeIncidents;
const LocationService = require('../controllers/locations');
const findOrCreateUser = require('../helpers/findOrCreateUser');
const listAssigneeIncidentsIncludes = require('../helpers/listAssigneeIncidentsIncludes');
const generateAssigneeOrCcdEmailBody = require('../helpers/generateAssigneeOrCcdEmailBody');
const emailHelper = require('../helpers/emailHelper');

let userAttributes = ['username', 'slackId', 'imageUrl', 'email'];

let includes = [
  {
    model: Level,
    attributes: ['name']
  },
  {
    model: Status,
    attributes: ['status']
  },
  {
    model: Location,
    attributes: ['name', 'centre', 'country']
  },
  {
    model: User,
    as: 'assignees',
    userAttributes,
    through: {
      attributes: ['assignedRole']
    }
  },
  {
    model: User,
    as: 'reporter',
    userAttributes,
    through: {
      attributes: []
    }
  },
  {
    model: User,
    as: 'witnesses',
    userAttributes,
    through: {
      attributes: []
    }
  }
];

// mapping Assignees
const mapAssignees = incident => {
  return incident.map(oneIncident => {
    oneIncident.dataValues.assignedRole =
      oneIncident.dataValues.assigneeIncidents.assignedRole;
    delete oneIncident.dataValues.assigneeIncidents;
    return oneIncident;
  });
};

const findIncidentById = (id, res) => {
  return Incident.findById(id, { include: includes })
    .then(incident => {
      return incident;
    })
    .catch(error => {
      throw error;
    });
};

/**
 * @function getUserDetails
 * @param payload object
 * @return userDetails object
*/
const getUserDetails = async payload => {
  let userDetails;
  if (Array.isArray(payload)) {
    payload.map(async ccdUser => {
      userDetails = await User.findById(ccdUser.userId);
      userDetails.dataValues.incidentId = ccdUser.incidentId;
      return userDetails;
    });
    return userDetails;
  }
  userDetails = await User.findById(payload.userId);
  userDetails.dataValues.incidentId  = payload.incidentId;
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
    assignedRole: payload.assignedRole // add assigned role
  });
  emailHelper.sendMail(emailBody,(error) => {
    if (error) {
      return error;
    }
    return {message: 'The email was sent successfully'};
  });
};


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
    return LocationService.create(location, res)
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
        }).then(user => {
          if (user) {
            return user.update({ slackId: incidentReporter.slackId });
          }
          return findOrCreateUser(incidentReporter, reporterLocation, res);
        }).catch(error => {
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
    if (res.locals.roleId === 2) {
      const includeForAssignee = listAssigneeIncidentsIncludes();
      const findIncidents = await User.findOne({ where: { id: res.locals.id}, include: includeForAssignee});
      const userAssignedIncidents = findIncidents.assignedIncidents;
      const mappedUserAssignedIncidents =  userAssignedIncidents.map(incident => {
        return {...incident.dataValues, reporter: incident.dataValues.reporter.length > 0 ? incident.dataValues.reporter[0] : {} };
      });
      return res
        .status(200)
        .send({ data: { incidents: mappedUserAssignedIncidents }, status: 'success' });
    }
    return Incident.findAll({
      include: includes
    })
      .then(incidents => {
        let mappedIncidents = incidents.map(incident => {
          incident.assignees && mapAssignees(incident.assignees);
          incident.dataValues.reporter = incident.dataValues.reporter[0];
          return incident;
        });
        res
          .status(200)
          .send({ data: { incidents: mappedIncidents }, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
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
    let assignedUser = req.body.assignee;
    let ccdUser = req.body.ccd;
    let destroyCcdPromise;
    let addCcdPromises = [];

    let findIncidentPromise = Incident.findById(req.params.id, {
      include: includes
    }).then(incident => {
      return incident
        ? Promise.resolve(incident)
        : Promise.reject({
          message: 'Incident not found',
          status: 'fail'
        });
    });

    if (assignedUser) {
      return findIncidentPromise
        .then(incident => {
          if (incident.dataValues.assignees.length === 0) {
            return User.findById(assignedUser.userId)
            // new assignee
              .then(async assignee => {
                assignedUser.assignedRole = 'assignee';
                await sendAssigneeOrCcdEmail(assignedUser);
                assignee.assigneeIncidents = {
                  assignedRole: 'assignee'
                };
                return incident.addAssignee(assignee);
              })
              .then(() => {
                return findIncidentById(incident.id, res);
              })
              .then(data => {
                return res.status(200).send({ data, status: 'success' });
              });
          } else {
            return AssigneeModel.destroy({
              where: {
                assignedRole: 'assignee',
                incidentId: incident.id
              }
            })
              .then(() => {
                return User.findById(assignedUser.userId);
              })
              // replacing an assignee
              .then(async assignee => {
                assignedUser.assignedRole = 'assignee';
                await sendAssigneeOrCcdEmail(assignedUser);
                assignee.assigneeIncidents = {
                  assignedRole: 'assignee'
                };
                return incident.addAssignee(assignee);
              })
              .then(() => {
                return findIncidentById(incident.id, res);
              })
              .then(data => {
                return res.status(200).send({ data, status: 'success' });
              });
          }
        })
        .catch(error => {
          errorLogs.catchErrors(error);
          return res.status(400).send(error);
        });
    } else if (ccdUser) {
      return findIncidentPromise
        .then(incident => {
          if (incident.dataValues.assignees.length === 0) {
            for (let i = 0; i < ccdUser.length; i++) {
              let addCcdPromise = User.findById(ccdUser[i].userId).then(async ccd => {
                let currentCcd = {...ccdUser[i], assignedRole: 'ccd'};
                await sendAssigneeOrCcdEmail(currentCcd);
                ccd.assigneeIncidents = {
                  assignedRole: 'ccd'
                };
                return incident.addAssignee(ccd);
              });
              addCcdPromises.push(addCcdPromise);
            }
          } else {
            return AssigneeModel.destroy({
              where: {
                assignedRole: 'ccd',
                incidentId: incident.id
              }
            })
              .then(() => {
                for (let i = 0; i < ccdUser.length; i++) {
                  let addCcdPromise = User.findById(ccdUser[i].userId).then(async ccd => {
                    let currentCcd = {...ccdUser[i], assignedRole: 'ccd'};
                    await sendAssigneeOrCcdEmail(currentCcd);
                    ccd.assigneeIncidents = {
                      assignedRole: 'ccd'
                    };
                    return incident.addAssignee(ccd);
                  });
                  addCcdPromises.push(addCcdPromise);
                }
                return Promise.all(addCcdPromises);
              })
              .then(() => {
                return findIncidentById(incident.id, res);
              })
              .then(data => {
                return res.status(200).send({ data, status: 'success' });
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
      include: includes,
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
      include: includes
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
