'use strict';

module.exports = (sequelize, DataTypes) => {
  const slackUsers = sequelize.define('slackUsers', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: DataTypes.STRING,
    channelName: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        slackUsers.hasOne(models.slackEvents, {
          foreignKey: 'userId',
          as: 'slackEvents'
        });
      }
    }
  });
  return slackUsers;
};
