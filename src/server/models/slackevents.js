'use strict';

module.exports = (sequelize, DataTypes) => {
  const slackEvents = sequelize.define('slackEvents', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    type: DataTypes.STRING,
    event_ts: DataTypes.STRING,
    user: DataTypes.STRING,
    ts: DataTypes.STRING,
    text: DataTypes.TEXT,
    channel: DataTypes.STRING,
    channel_type: DataTypes.STRING,
  }, {
    associate: (models) => {
      slackEvents.hasMany(models.userSlackEvents, {
        foreignKey: 'slackEventId',
        as: 'userSlackEvents'
      });
    }
  });
  return slackEvents;
};
