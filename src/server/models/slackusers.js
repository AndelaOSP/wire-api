'use strict';

module.exports = (sequelize, DataTypes) => {
  const slackUsers = sequelize.define('slackUsers', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    channelName: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        slackUsers.hasMany(models.SlackWireEvents, {
          foreignKey: 'userId',
          sourceKey: 'id',
          as: 'chats'
        });
      }
    }
  });
  return slackUsers;
};
