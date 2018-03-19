const User = require('../models').Users;
const Role = require('../models').Roles;

module.exports = {
  // add a User
  create(id, email, name, imageUrl, roleId) {
    return User
      .findOne({ where: { id, email } })
      .then(user => {
        if (user) {
          return Promise.resolve('Resolved');
        }
        return User.create({
          id,
          email,
          name,
          imageUrl,
          roleId
        });
      }).then(user => {
        return Promise.resolve(user);
      })
      .catch(error => {
        throw (error);
      });
  },
};
