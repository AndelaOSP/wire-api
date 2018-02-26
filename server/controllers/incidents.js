const Incident = require("../models").Incidents;
const User = require("../models").Users;
const Location = require("../models").Locations;
const Level = require("../models").Levels;
const Status = require("../models").Statuses;
const LocationService = require("../services/locations");

module.exports = {
  //create an incident
  create(req, res) {
    let locationPromise;
    name = req.body.name,
      centre = req.body.centre,
      country = req.body.country
    return Location.findOne({ where: { name, centre, country } })
      .then(location => {
        (!location) ?
          locationPromise =
          LocationService.create(name, centre, country).then(location => {
            return Promise.resolve(location.dataValues.id);
          }).catch(error => {
            res.status(400).send(error);
          })
          :
          locationPromise = Promise.resolve(location.dataValues.id);
        locationPromise.then(locationId => {
          Incident
            .create({
              description: req.body.description,
              subject: req.body.subject,
              dateOccurred: req.body.dateOccurred,
              userId: req.body.userId,
              statusId: req.body.statusId || 1,
              locationId,
              levelId: req.body.levelId
            })
            .then(incident => {
              res.status(201).send({ data: incident, status: "success" });
            }).catch(error => {
              res.status(400).send(error);
            });
        })
      })
  },

  // get all incidents
  list(req, res) {
    return Incident
      .findAll({
        include: [{
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
          attributes: ['name', 'imageUrl', 'email']
          },
          {
          model: User,
          as: 'Assignees',
          attributes: ['name', 'imageUrl', 'email']
          }
        ]
      })
      .then(incident => {
        res.status(200).send({ data: { incidents: incident }, status: "success" });
      })
      .catch(error => {
        res.status(400).send(error)
      });
  },

  // retrieve an incident by ID
  findById(req, res) {
    return Incident
      .findById(req.params.id, {
        include: [{
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
          key: 'userId',
          attributes: ['name', 'imageUrl', 'email']
        },{
          model: User,
          as: 'Assignees',
          attributes: ['name', 'imageUrl', 'email']
          }]
      })
      .then(incident => {
        if (!incident) {
          return res.status(404).send({
            message: 'Incident not found', status: "fail"
          });
        }
        res.status(200).send({ data: incident, status: "success" });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // update an incident
  update(req, res) {
    return Incident
      .findById(req.params.id,
        {
          include: [{
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
            key: 'userId',
            attributes: ['name', 'imageUrl', 'email']
          },{
            model: User,
            as: 'Assignees',
            attributes: ['name', 'imageUrl', 'email']
            }]
        })
      .then(incident => {
        if (!incident) {
          return res.status(404).send({
            message: 'Incident Not Found', status: "fail"
          });
        }
        return incident
          .update({
            description: req.body.description || incident.description,
            subject: req.body.subject || incident.subject,
            dateOccurred: req.body.dateOccurred || incident.dateOccurred,
            statusId: req.body.statusId || incident.statusId,
            locationId: req.body.locationId || incident.locationId,
            categoryId: req.body.categoryId || incident.categoryId,
            assigneeId: req.body.assigneeId || incident.assigneeId,
            levelId: req.body.levelId || incident.levelId
          })
          .then(() => res.status(200).send({ data: incident, status: "success" }))
          .catch(error => res.status(400).send(error));
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
