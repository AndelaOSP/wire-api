const { findOrCreateLocation } = require('./locationHelper');
const User = require('../models').Users;

const findOrCreateUser = async (userType, userLocation, res) => {
  const location = await findOrCreateLocation(userLocation, res);

  let userObject = {
    where: {
      email: userType.email,
    },
    defaults: {
      slackId: userType.slackId,
      email: userType.email,
      username: userType.username,
      roleId: userType.roleId,
      locationId: location.id,
    },
    plain: true,
  };

  return User.findOrCreate(userObject);
};

module.exports = findOrCreateUser;
