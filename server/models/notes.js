
let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const Notes = sequelize.define('Notes', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => cuid()
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Notes.belongsTo(models.Incidents, {
          foreignKey: 'incidentId',
          onDelete: 'CASCADE'
        });
        Notes.belongsTo(models.Users, {
          foreignKey: 'userEmail',
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return Notes;
};
