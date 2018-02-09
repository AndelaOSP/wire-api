'use strict';
module.exports = function(sequelize, DataTypes) {
  const Assignees = sequelize.define('Assignees', {
  }, {
    classMethods: {
      associate: function(models) {
        Assignees.belongsTo(models.Users, {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        });
        Assignees.hasMany(models.Incidents, {
          foreignKey: 'assigneeId',
          as: 'incidents'
        });
      }
    }
  });
  return Assignees;
};
