'use strict';

let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const userSlackEvents = sequelize.define('userSlackEvents', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => cuid()
    },
    username: DataTypes.STRING,
    channel_name: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        userSlackEvents.belongsTo(models.slackEvents, {
          foreignKey: 'slackEventId',
          onDelete: 'CASCADE',
          allowNull: false,
        });
      }
    }
  });
  return userSlackEvents;
};
