/* eslint-disable max-lines-per-function */
let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const Notifications = sequelize.define(
    'Notifications',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => cuid(),
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      notificationTypeId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      incidentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notificationGroupId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      classMethods: {
        associate: models => {
          Notifications.belongsTo(models.NotificationTypes, {
            foreignKey: 'notificationTypeId',
            onDelete: 'NO ACTION',
            allowNull: false,
          });
          Notifications.belongsTo(models.Incidents, {
            foreignKey: 'incidentId',
            onDelete: 'CASCADE',
            allowNull: false,
          });
          Notifications.belongsTo(models.NotificationGroups, {
            foreignKey: 'notificationGroupId',
            onDelete: 'CASCADE',
            allowNull: false,
          });
        },
      },
    }
  );
  return Notifications;
};
