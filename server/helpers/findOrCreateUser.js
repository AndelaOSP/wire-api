const { findOrCreateLocation } = require('./locationHelper');
const User = require('../models').Users;

const findOrCreateUser = (userType, userLocation, res) => {
  return findOrCreateLocation(userLocation, res)
    .then(location => {
      return location.dataValues.id;
    })
    .then(locationId => {
      let userObject = {
        where: {
          email: userType.email,
        },
        defaults: {
          slackId: userType.slackId,
          email: userType.email,
          username: userType.username,
          roleId: userType.roleId,
          locationId,
        },
        plain: true,
      };
      return User.findOrCreate(userObject);
    })
    .catch(error => {
      return error;
    });
};
module.exports = findOrCreateUser;
