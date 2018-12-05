const models = require('../models');

/**
 * @function matchRoleIdToRoleName
 * @param INTEGER roleId
 * @returns STRING roleName
 */

module.exports = async roleId => {
  const role = await models.Roles.findById(roleId);
  return role.name;
};
