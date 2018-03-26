const Role = require('../models').Roles;

module.exports = {
  // add a role, incase admin needs an additional one
  create(req, res) {
    const { name } = req.body;
    return Role
      .findOne({ where: { name } })
      .then((role) => {
        if (role) {
          return res.status(400).send({
            message: `The role ${name} already exists`, status: 'fail'
          });
        }
        if (!name) {
          return res.status(400).send({
            message: 'Please enter the role name', status: 'fail'
          });
        }
        Role.create({
          name: req.body.name
        })
          .then (role => {
            return res.status(201).send({ data:role, status: 'success' });
          });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // view all roles
  list(req, res) {
    return Role
      .findAll()
      .then(role => {
        return res.status(200).send({ data: { roles: role }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // retrieve a Role by ID
  findById(req, res) {
    return Role
      .findById(req.params.id)
      .then(role => {
        if (!role) {
          return res.status(404).send({
            message: 'Role not found', status: 'fail'
          });
        }
        return res.status(200).send({ data: role, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },


  // update a role
  update(req, res) {
    return Role
      .findById(req.params.id)
      .then(role => {
        if (!role) {
          return res.status(404).send({
            message: 'Role not found', status: 'fail'
          });
        }
        return role
          .update({
            name: req.body.name
          })
          .then(() => {
            return res.status(200).send({ data: role, status: 'success' });
          });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },
};
