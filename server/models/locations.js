
let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const Locations = sequelize.define('Locations', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => cuid()
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    centre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    country: {
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
        });
        Locations.hasMany(models.Users, {
          foreignKey: 'locationId',
          as: 'users'
        });
      }
    }
  });
  return Locations;
};
