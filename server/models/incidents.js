'use strict';
module.exports = (sequelize, DataTypes) => {
  const Incidents = sequelize.define('Incidents', {
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    witnesses: {
      type: DataTypes.TEXT
    },
    date_occurred: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    classMethods: {
      associate: (models) => {
        Incidents.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
        Incidents.belongsTo(models.Categories, {
          foreignKey: 'categoryId',
          onDelete: 'CASCADE'
        });
        Incidents.belongsTo(models.Status, {
          foreignKey: 'statusId',
          onDelete: 'CASCADE'
        });
        Incidents.belongsTo(models.Locations, {
          foreignKey: 'locationId',
          onDelete: 'CASCADE'
        });
        Incidents.hasMany(models.Notes, {
          foreignKey: 'incidentId',
          as: 'notes'
        });
    }
  }
});
  return Incidents;
};
