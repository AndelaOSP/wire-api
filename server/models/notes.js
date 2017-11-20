'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notes = sequelize.define('Notes', {
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
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
        Notes.hasMany(models.Replies, {
        foreignKey: 'noteId',
        as: 'replies'
      })
    }
  }
});
  return Notes;
};
