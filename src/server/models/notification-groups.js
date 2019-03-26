/* eslint-disable max-lines-per-function */
let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const NotificationGroups = sequelize.define(
    'NotificationGroups',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => cuid(),
      },
    },
    {
      classMethods: {
        associate: models => {
          NotificationGroups.belongsToMany(models.Users, {
            through: 'UserGroup',
          });
        },
      },
    }
  );
  return NotificationGroups;
};
