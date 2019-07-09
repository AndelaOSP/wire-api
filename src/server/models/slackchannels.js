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
  }, {});
  SlackChannels.associate = function(models) {
    // associations can be defined here
  };
  return SlackChannels;
};