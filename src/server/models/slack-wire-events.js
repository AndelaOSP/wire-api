'use strict';

const cuid = require('cuid');

// eslint-disable-next-line max-lines-per-function
module.exports = (sequelize, DataTypes) => {
  const SlackWireEvents = sequelize.define(
    'SlackWireEvents',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: () => cuid(),
      },
      type: DataTypes.STRING,
      eventTs: DataTypes.STRING,
      userId: DataTypes.STRING,
      ts: DataTypes.STRING,
      text: DataTypes.TEXT,
      channelId: DataTypes.STRING,
      channelType: DataTypes.STRING,
    },
    {}
  );
  return SlackWireEvents;
};
