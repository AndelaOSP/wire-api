const userService = require('../services/users');
const User = require('../models').Users;
const Incident = require('../models').Incidents;

module.exports = {
  // add a user
  create(req, res) {
    const id = req.body.id;
    const email = req.body.email;
    const name = req.body.name;
    const imageUrl = req.body.imageUrl;
    const roleId = req.body.roleId || 1;
    userService.create(id, email, name, imageUrl, roleId).then(user => {
      if (user === 'Resolved') {
        return res.status(200).send({message: 'This user already exists'});
      }
      res.status(201).send({ data: user, status: 'success' });
    }).catch(error => {
      res.status(400).send(error);
    });
  },
  // GET admins/super admins
  list(req, res) {
    return User
      .findAll({
        where: {
          roleId: 2 || 3
        }
      })
      .then(user => {
        res.status(200).send({ data: { users: user }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },
  getUserById(req, res) {
    return User.findById(req.params.userId, 
      {
        include: [
          {
            model: Incident, 
            as: 'reportedIncidents',
            through: {
              attributes: []
            }
          },
          {
            model: Incident,
            as: 'assignedIncidents',
            through: {
              attributes: []
            }
          }
        ]
      }
    ).then(user=> {
      res.status(200).send(user);
    }).catch(err=> {
      res.status(400).send(err);
    });
  }
};
