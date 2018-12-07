const Category = require('../models').Categories;

module.exports = {
  // view all categories
  async list(req, res) {
    const categories = await Category.findAll();
    res.status(200).send({ data: { categories }, status: 'success' });
  },
};
