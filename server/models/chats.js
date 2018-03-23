
let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const Chats = sequelize.define('Chats', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => cuid()
    },
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
        });
      }
    }
  });
  return Chats;
};
