const errorLogs = require('./errorLogs');
const Category = require('../models').Categories;
const Incident = require('../models').Incidents;

module.exports = {
  // view all categories
  list(req, res) {
    return Category
      .findAll()
      .then(category => {
        res.status(200).send({ data: { categories: category }, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  },
};
