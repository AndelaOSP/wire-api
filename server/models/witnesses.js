'use strict';
module.exports = (sequelize, DataTypes) => {
  const Witnesses = sequelize.define('Witnesses', {
  }, {
    classMethods: {
      associate: (models) => {
        Witnesses.belongsTo(models.Users, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          allowNull: false
        });
        Witnesses.belongsTo(models.Incidents, {
          foreignKey: 'incidentId',
          onDelete: 'CASCADE',
          allowNull: false
        });
      }
    }
  });
  return Witnesses;
};
