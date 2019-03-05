/* eslint-disable max-lines-per-function */
let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const NotificationTypes = sequelize.define(
    'NotificationTypes',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => cuid(),
      },
      name: {
        type: DataTypes.ENUM(
          'ChatUpdate',
          'AssigneeStatusChanged',
          'CCOnIncident',
          'NewIncidentAdded',
          'AssignedToIncident'
        ),
        allowNull: false,
      },
    },
    {
      classMethods: {
        associate: models => {
          NotificationTypes.hasMany(models.Notifications, {
            foreignKey: 'notificationId',
            as: 'notifications',
          });
        },
      },
    }
  );
  return NotificationTypes;
};
