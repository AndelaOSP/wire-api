const Level = require('../models').Levels;
const Incident = require('../models').Incidents;

module.exports = {
  //add a level, incase admin needs an additional one
  create(req, res) {
    const { name } = req.body;
    return Level
      .findOne({ where: { name } })
      .then((level) => {
        if (level) {
          return res.status(400).send({
            message: `The level '${name}' already exists`, status: 'fail'
          });
        }
        if (!name) {
          return res.status(400).send({
            message: 'Please enter the level name', status: 'fail'
          });
        }
        Level.create({
          name: req.body.name
        })
          .then(level => {
            return res.status(201).send({ data: level, status: 'success' });
          });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // view all levels
  list(req, res) {
    return Level
      .findAll()
      .then(level => {
        res.status(200).send({ data: { levels: level }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // retrieve a level by ID
  findById(req, res) {
    return Level
      .findById(req.params.id)
      .then(level => {
        if (!level) {
          return res.status(404).send({
            message: 'level does not exist', status: 'fail'
          });
        }
        res.status(200).send({ data: level, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // update a level
  update(req, res) {
    return Level
      .findById(req.params.id)
      .then(level => {
        if (!level) {
          return res.status(404).send({
            message: 'level not found', status: 'fail'
          });
        }
        return level
          .update({
            name: req.body.name
          })
          .then(() => res.status(200).send({ data: level, status: 'success' })
          );
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // filter incidents by level
  listIncidents(req, res) {
    return Incident
      .findAll({
        where: {
          levelId: req.params.id
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
