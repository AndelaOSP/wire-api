const LocationService = require('../controllers/locations');
const User = require('../models').Users;

const findOrCreateUser = (userType, userLocation, res) => {
  return LocationService.create(userLocation, res)
    .then(location => {
      return location.dataValues.id;
    })
    .then(locationId => {
      let userObject = {
        where: {
          id: userType.userId
        },
        defaults: {
          email: userType.email,
          imageUrl: userType.imageUrl,
          username: userType.username,
          roleId: userType.roleId,
          locationId
        }
      };
      return User.findOrCreate(userObject);
    });
};
module.exports = findOrCreateUser;
