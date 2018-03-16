const Incident = require("../models").Incidents;
const User = require("../models").Users;
const Location = require("../models").Locations;
const Level = require("../models").Levels;
const Status = require("../models").Statuses;
const LocationService = require("../services/locations");

let userAttributes = ['name', 'imageUrl', 'email'];

let includes = [{
  model: Level,
  attributes: ['name']
}, {
  model: Status,
  attributes: ['status']
}, {
  model: Location,
  attributes: ['name', 'centre', 'country']
}, {
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
}]

// mapping Assignees
const mapAssignees = (incident) => {
return incident.map(oneIncident => {
  oneIncident.dataValues.assignedRole = oneIncident.dataValues.assigneeIncidents.assignedRole;
    delete oneIncident.dataValues.assigneeIncidents;
    return oneIncident
    });
  }

module.exports = {
  // create an incident
  create(req, res) {
    let locationPromise;
    name = req.body.name,
    centre = req.body.centre,
    country = req.body.country
    return LocationService.create(name, centre, country).then(location => {
      return location.dataValues.id;
    }).then(locationId=> {
      return Incident.create({
        description: req.body.description,
        subject: req.body.subject,
        dateOccurred: req.body.dateOccurred,
        statusId: req.body.statusId || 1,
        locationId,
        levelId: req.body.levelId
      });
    }).then(incident=> {
      return User.findById(req.body.userId).then(user => {
        return incident.addReporter(user);
      }).then(()=> {
        return incident;
      });
    }).then(incident=> {
      res.status(201).send({ data: incident, status: "success" });
    })
    .catch(error => {
      res.status(400).send(error);
    });
  },

  // get all incidents
  list(req, res) {
    return Incident
      .findAll({
        include: includes
      })
      .then(incidents => {
        let mappedIncidents = incidents.map(incident => {
          incident.assignees && mapAssignees(incident.assignees);
          incident.dataValues.reporter = incident.dataValues.reporter[0];
          return incident;
      })
        res.status(200).send({ data: { incidents: mappedIncidents }, status: "success" });
      })
      .catch(error => {
        res.status(400).send(error)
      });
  },

  // retrieve an incident by ID
  findById(req, res) {
    return Incident
      .findById(req.params.id, {
        include: includes
      })
      .then(incident => {
        if (!incident) {
          return res.status(404).send({
            message: 'Incident not found', status: "fail"
          });
        }
        incident.assignees && mapAssignees(incident.assignees);
        incident.dataValues.reporter = incident.dataValues.reporter[0];
        res.status(200).send({ data: incident, status: "success" });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // update an incident
  update(req, res) {
    let assignedRole = req.body.assignedRole
    return Incident.findById(req.params.id, {
      include: includes
    })
      .then(incident => {
        if (!incident) {
          res.status(404).send({
            message: 'Incident not found', status: "fail"
          })
        }
        return incident.update({
          description: req.body.description || incident.description,
          subject: req.body.subject || incident.subject,
          dateOccurred: req.body.dateOccurred || incident.dateOccurred,
          statusId: req.body.statusId || incident.statusId,
          locationId: req.body.locationId || incident.locationId,
          categoryId: req.body.categoryId || incident.categoryId,
          levelId: req.body.levelId || incident.levelId
        })
      }).then(incident => {
        return User.findById(req.body.userId).then(assignees => {
          return incident.addAssignees(assignees, { assignedRole: req.body.assignedRole });
        }).then(() => {
          return incident
        })
      }).then(incident => {
        res.status(200).send({ data: incident, status: "success" });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // delete an incident by ID. To be refactored into archive incidents that are old and resolved.
  delete(req, res) {
    return Incident
      .findById(req.params.id)
      .then(incident => {
        if (!incident) {
          return res.status(404).send({
            message: 'Incident not found', status: "fail"
          });
        }
        return incident
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      });
  },
}
