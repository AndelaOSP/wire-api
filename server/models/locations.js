'use strict';
module.exports = (sequelize, DataTypes) => {
  const Locations = sequelize.define('Locations', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    classMethods: {
      associate: (models) => {
        Locations.hasMany(models.Incidents, {
        foreignKey: 'locationId',
        as: 'incidents'
      })
    }
  }
});
  return Locations;
};
