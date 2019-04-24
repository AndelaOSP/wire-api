'use strict';
let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const appChat = sequelize.define('appChat', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => cuid()
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });
  return appChat;
};
