const errorLogs = require('./errorLogs');
const Incident = require('../models').Incidents;
const User = require('../models').Users;
const Location = require('../models').Locations;
const Level = require('../models').Levels;
const Status = require('../models').Statuses;
const AssigneeModel = require('../models').assigneeIncidents;
const LocationService = require('../controllers/locations');

/**
 * Represents the user attributes.
 */

let userAttributes = ['username', 'imageUrl', 'email'];

/**
 * Represents includes attached to an incident after a succesfull post.
 */

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

/**
 * Represents a method to create a user.
 * @function
 * @param {Object} userType- Takes in the user Type ie the Reporter.
 * @param {Object} location- Takes in the user's/Reporters location.
 * @param {Object} res- The response body after a successfull of unsuccesful user creation.
 * @defaultvalue
 * @returns {Object}
 */

const findOrCreateUser = (userType, location, res) => {
  return LocationService.create(location, res)
    .then(location => {
      return location.dataValues.id;
    })
    .then(locationId => {
      let userObject = {
        where: {
          id: userType.userId
        },
        defaults: {
          email: userType.email,
          imageUrl: userType.imageUrl,
          username: userType.username,
          roleId: 1,
          locationId
        }
      };
      return User.findOrCreate(userObject);
    });
};

/**
 * Represents a method to find an incident by Id.
 * Takes in the incident Id as a parameter to the requst body
 * @function
 * @param {string} id - chat Id
 * @returns an incident
 */

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
 * Represents a method post/create an incident.
 * includes the users model to get user type info ie role and location
 * @function
 * @returns {Object}
 */

module.exports = {
  // create an incident
  create(req, res) {
    let location = req.body.location;
    let witnesses = req.body.witnesses;
    let reporterLocation = req.body.incidentReporter.reporterLocation;
    let incidentReporter = req.body.incidentReporter;
    let { subject, description, dateOccurred, levelId } = req.body;
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
        return findOrCreateUser(incidentReporter, reporterLocation, res);
      })
      .then(createdReporter => {
        let reporter = createdReporter[0];
        createdIncident.addReporter(reporter);
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

  /**
   * Represents a method to list all available incidents.
   * @function
   * @returns {object} returns an object with incidents objects
   */
  list(res) {
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

  /**
   * Represents a method to find an incident by Id.
   * Takes in the incident Id as a parameter to the reqeust body
   * @function
   * @param {string} id - incident Id
   * @returns {object}
   */
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

  /**
   * Represents a method to update an incident by Id.
   * Takes in the incident Id as a parameter to the request body.
   * Only update the incident with adding a ccd user or an assignee.
   * @function
   * @param {string} req- incindent Id.
   * @param {object} res - response body.
   * @returns {object}
   */
  update(req, res) {
    let assignee = req.body.assignee;
    let ccd = req.body.ccd;
    let destroyCcdPromise;
    let addCcdPromises = [];

    let findIncidentPromise = Incident.findById(req.params.id, {
      include: includes
    }).then(incident => {
      return incident
        ? Promise.resolve(incident)
        : Promise.reject({ message: 'Incident not found', status: 'fail' });
    });

    if (assignee) {
      return findIncidentPromise
        .then(incident => {
          if (incident.dataValues.assignees.length === 0) {
            return User.findById(assignee.userId)
              .then(assignee => {
                return incident.addAssignee(assignee, {
                  assignedRole: 'assignee'
                });
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
                assignedRole: 'assignee'
              }
            })
              .then(() => {
                return User.findById(assignee.userId);
              })
              .then(assignee => {
                return incident.addAssignee(assignee, {
                  assignedRole: 'assignee'
                });
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
    } else if (ccd) {
      return findIncidentPromise
        .then(incident => {
          if (incident.dataValues.assignees.length === 0) {
            for (let i = 0; i < ccd.length; i++) {
              let addCcdPromise = User.findById(ccd[i].userId).then(ccd => {
                return incident.addAssignee(ccd, { assignedRole: 'ccd' });
              });
              addCcdPromises.push(addCcdPromise);
            }
          } else {
            return AssigneeModel.destroy({
              where: {
                assignedRole: 'ccd'
              }
            })
              .then(() => {
                for (let i = 0; i < ccd.length; i++) {
                  let addCcdPromise = User.findById(ccd[i].userId).then(ccd => {
                    return incident.addAssignee(ccd, { assignedRole: 'ccd' });
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

  /**
   * Represents a method to delete an incident by Id.
   * Takes in the incident Id as a parameter to the reqeust body
   * @function
   */

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

  /**
   * Represents a method to search an incident by subject or description.
   * @function
   * @returns {object}
   */
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

  /**
   * Represents a method to filter incidents according to categories.
   * @function
   * @returns {object}
   */
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
