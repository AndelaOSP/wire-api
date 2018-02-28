'use strict';
module.exports = (sequelize, DataTypes) => {
  const Incidents = sequelize.define('Incidents', {
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dateOccurred: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    classMethods: {
      associate: (models) => {
        Incidents.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        allowNull: false
      });
        Incidents.belongsTo(models.Categories, {
          foreignKey: 'categoryId',
          onDelete: 'CASCADE',
          allowNull: false
        });
        Incidents.belongsTo(models.Statuses, {
          foreignKey: 'statusId',
          onDelete: 'CASCADE',
          allowNull: false
        });
        Incidents.belongsTo(models.Locations, {
          foreignKey: 'locationId',
          onDelete: 'CASCADE',
          allowNull: false
        });
        Incidents.belongsTo(models.Levels, {
          foreignKey: 'levelId',
          onDelete: 'CASCADE'
        });
        Incidents.hasMany(models.Notes, {
          foreignKey: 'incidentId',
          as: 'notes'
        });
        Incidents.hasMany(models.Chats, {
          foreignKey: 'incidentId',
          as: 'chats'
        });
        Incidents.belongsTo(models.Users, {
          foreignKey: 'assigneeId',
          as: 'Assignee',
          onDelete: 'CASCADE',
        });
    }
  }
});
  return Incidents;
};
