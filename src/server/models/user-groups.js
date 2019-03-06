/* eslint-disable max-lines-per-function */
let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const UserGroups = sequelize.define('UserGroups', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => cuid(),
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notificationGroupId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return UserGroups;
};
