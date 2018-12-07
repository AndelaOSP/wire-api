const Role = require('../models').Roles;

module.exports = {
  list: async (req, res) => {
    const roles = await Role.findAll();

    return res.status(200).send({ data: { roles }, status: 'success' });
  },
};
