const Incident = require('../models').Incidents;
const User = require('../models').Users;
const Location = require('../models').Locations;
const Level = require('../models').Levels;
const Status = require('../models').Statuses;
const LocationService = require('../controllers/locations');

let userAttributes = ['username', 'imageUrl', 'email'];

let includes = [
  {
    model: Level,
    attributes: ['name'],
  },
  {
    model: Status,
    attributes: ['status'],
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
    through: {
      attributes: [],
    },
  },
  {
    model: User,
    as: 'witnesses',
    userAttributes,
    through: {
      attributes: [],
    },
  },
];

// mapping Assignees
const mapAssignees = incident => {
  return incident.map(oneIncident => {
    oneIncident.dataValues.assignedRole = oneIncident.dataValues.assigneeIncidents.assignedRole;
    delete oneIncident.dataValues.assigneeIncidents;
    return oneIncident;
  });
};

function findOrCreateUser(userType) {
  let userObject = {
    where: {
      id: userType.userId,
    },
    defaults: {
      email: userType.email,
      imageUrl: userType.imageUrl,
      username: userType.username,
      roleId: 1,
    },
  };
  return User.findOrCreate(userObject);
}

function findUserById(id) {
  return Incident.findById(id, { include: includes })
    .then(incident => {
      if (!incident) {
        return res.status(404).send({ message: 'Incident not found', status: 'fail' });
      }
      incident.assignees && mapAssignees(incident.assignees);
      incident.dataValues.reporter = incident.dataValues.reporter[0];
      return incident;
    })
    .catch(error => {
      return error;
    });
}

module.exports = {
  // create an incident
  create(req, res) {
    let location = req.body.location;
    let witnesses = req.body.witnesses;
    let incidentReporter = req.body.incidentReporter;
    let { subject, description, dateOccurred, levelId } = req.body;
    let createdIncident;

    return LocationService.create(location, res)
      .then(location => {
        return location.dataValues.id;
      })
      .then(locationId => {
        return Incident.create({
          description: req.body.description,
          subject: req.body.subject,
          dateOccurred: req.body.dateOccurred,
          statusId: req.body.statusId || 1,
          locationId,
          levelId: req.body.levelId,
        });
      })
      .then(incident => {
        createdIncident = incident;
        return findOrCreateUser(incidentReporter);
      })
      .then(createdReporter => {
        let reporter = createdReporter[0];
        createdIncident.addReporter(reporter);
      })
      .then(() => {
        let witnessCreationPromises = [];
        if (witnesses.length > 0) {
          for (let i = 0; i < witnesses.length; i++) {
            let witness = witnesses[i];
            let witnessCreationPromise = findOrCreateUser(witness);
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
            addedWitnessesPromises.push(createdIncident.addWitness(mappedWitnesses[i]));
          }
        }
        return Promise.all(addedWitnessesPromises);
      })
      .then(() => {
        return findUserById(createdIncident.id);
      })
      .then(data => {
        res.status(201).send({ data, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // get all incidents
  list(req, res) {
    return Incident.findAll({
      include: includes,
    })
      .then(incidents => {
        let mappedIncidents = incidents.map(incident => {
          incident.assignees && mapAssignees(incident.assignees);
          incident.dataValues.reporter = incident.dataValues.reporter[0];
          return incident;
        });
        res.status(200).send({ data: { incidents: mappedIncidents }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // retrieve an incident by ID
  findById(req, res) {
    return findUserById(req.params.id)
      .then(incident => {
        res.status(200).send({ data: incident, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // update an incident
  update(req, res) {
    let assignedRole = req.body.assignedRole;
    return Incident.findById(req.params.id, {
      include: includes,
    })
      .then(incident => {
        if (!incident) {
          res.status(404).send({
            message: 'Incident not found',
            status: 'fail',
          });
        }
        return incident.update({
          description: req.body.description || incident.description,
          subject: req.body.subject || incident.subject,
          dateOccurred: req.body.dateOccurred || incident.dateOccurred,
          statusId: req.body.statusId || incident.statusId,
          locationId: req.body.locationId || incident.locationId,
          categoryId: req.body.categoryId || incident.categoryId,
          levelId: req.body.levelId || incident.levelId,
        });
      })
      .then(incident => {
        return User.findById(req.body.userId)
          .then(assignees => {
            return incident.addAssignees(assignees, {
              assignedRole: req.body.assignedRole,
            });
          })
          .then(() => {
            return incident;
          });
      })
      .then(incident => {
        res.status(200).send({ data: incident, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // delete an incident by ID. To be refactored into archive incidents that are old and resolved.
  delete(req, res) {
    return Incident.findById(req.params.id).then(incident => {
      if (!incident) {
        return res.status(404).send({
          message: 'Incident not found',
          status: 'fail',
        });
      }
      return incident
        .destroy()
        .then(() => res.status(204).send())
        .catch(error => res.status(400).send(error));
    });
  },

  //search an incident by subject or description.
  search(req, res) {
    if (!req.query.q) {
      return res.status(400).send({ message: 'please provide query' });
    }
    return Incident.findAll({
      where: {
        $or: [{ subject: { $ilike: `%${req.query.q}%` } }, { description: { $ilike: `%${req.query.q}%` } }],
      },
    })
      .then(incident => {
        res.status(200).send({ data: { incidents: incident }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },
};
