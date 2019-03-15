/* eslint-disable max-lines-per-function */
let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: () => cuid(),
      },
      slackId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: true,
      },
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      classMethods: {
        associate: models => {
          Users.hasMany(models.Notes, {
            foreignKey: 'userEmail',
            sourceKey: 'email',
            as: 'notes',
          });
          Users.belongsTo(models.Roles, {
            foreignKey: 'roleId',
            onDelete: 'CASCADE',
            allowNull: false,
          });
          Users.belongsTo(models.Locations, {
            foreignKey: 'locationId',
            onDelete: 'CASCADE',
            allowNull: false,
          });
          Users.belongsToMany(models.Incidents, {
            through: 'userIncidents',
            foreignKey: 'userId',
            as: 'reportedIncidents',
            otherKey: 'incidentId',
          });
          Users.belongsToMany(models.Incidents, {
            through: 'assigneeIncidents',
            foreignKey: 'userId',
            as: 'assignedIncidents',
            otherKey: 'incidentId',
          });
          Users.belongsToMany(models.Incidents, {
            through: 'Witnesses',
            foreignKey: 'userId',
            as: 'incidentWitnesses',
            otherKey: 'incidentId',
          });
          Users.belongsToMany(models.NotificationGroups, {
            through: 'UserGroup',
          });
        },
      },
    }
  );
  return Users;
};
