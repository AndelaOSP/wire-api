'use strict';
module.exports = (sequelize, DataTypes) => {
  const SlackChannels = sequelize.define('SlackChannels', {
    incidentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    channelId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    channelName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    channelMembers: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        SlackChannels.belongsTo(models.Incidents,{
          foreignKey: 'IncidentId',
          onDelete: 'CASCADE',
          allowNull: false,
        });
        SlackChannels.hasMany(models.SlackWireEvents, {
          foreignKey: 'channelId',
          as: 'chats' 

          
        })
      }
    }
  });
  return SlackChannels;
};