'use strict';

module.exports = (sequelize, DataTypes) => {
  const slackEvents = sequelize.define('slackEvents', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    type: DataTypes.STRING,
    eventTs: DataTypes.STRING,
    slackUserId: DataTypes.STRING,
    ts: DataTypes.STRING,
    text: DataTypes.TEXT,
    channelId: DataTypes.STRING,
    channelType: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        slackEvents.belongsTo(models.slackUsers, {
          foreignKey: 'slackUserId',
          as: 'slackUser',
          onDelete: 'CASCADE',
          allowNull: false,
        });
      }
    }
  });
  return slackEvents;
};
