const Category = require('../models').Categories;
const Incident = require('../models').Incidents;

module.exports = {
  //add a category
  create(req, res) {
    const { name } = req.body;
    return Category
      .findOne({ where: { name } })
      .then((category) => {
        if (category) {
          return res.status(400).send({
            message: `The category '${name}' already exists`, status: 'fail'
          });
        }
        if (!name) {
          return res.status(400).send({
            message: 'Please enter the category name', status: 'fail'
          });
        }
        Category.create({
          name: req.body.name,
          levelId: req.body.levelId,
          visible: req.body.visible || 0
        })
          .then (category => {
            return res.status(201).send({ data:category, status: 'success' });
          });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // view all categories
  list(req, res) {
    return Category
      .findAll()
      .then(category => {
        res.status(200).send({ data: { categories: category }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // retrieve a category by ID
  findById(req, res) {
    return Category
      .findById(req.params.id)
      .then(category => {
        if (!category) {
          return res.status(404).send({
            message: 'category does not exist', status: 'fail'
          });
        }
        res.status(200).send({ data:category, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // update a category
  update(req, res) {
    return Category
      .findById(req.params.id)
      .then(category => {
        if (!category) {
          return res.status(404).send({
            message: 'category not found', status: 'fail'
          });
        }
        return category
          .update({
            name: req.body.name || category.name,
            levelId: req.body.levelId || category.levelId,
            visible: req.body.visible || category.visible
          })
          .then(() => res.status(200).send({ data: category, status: 'success' }))
          .catch(error => res.status(400).send(error));
      });
  },

  // filter incidents by category
  listIncidents(req, res) {
    return Incident
      .findAll({
        where: {
          categoryId: req.params.id
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
