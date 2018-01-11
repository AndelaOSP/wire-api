'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chats = sequelize.define('Chats', {
    chat: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Chats.belongsTo(models.Incidents, {
        foreignKey: 'incidentId',
        onDelete: 'CASCADE'
      });
        Chats.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  }
});
  return Chats;
};
