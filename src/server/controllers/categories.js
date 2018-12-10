const Category = require('../models').Categories;
const Incident = require('../models').Incidents;

module.exports = {
  // view all categories
  list(req, res) {
    return Category.findAll().then(category => {
      res
        .status(200)
        .send({ data: { categories: category }, status: 'success' });
    });
  },
};
