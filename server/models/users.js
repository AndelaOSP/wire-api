'use strict';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: true,
    },
    access_level: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
    {
      classMethods: {
        associate: (models) => {
          Users.hasMany(models.Incidents, {
            foreignKey: 'userId',
            as: 'userId'
          });
          Users.hasMany(models.Notes, {
            foreignKey: 'userId',
            as: 'userId'
          });
          Users.hasMany(models.Replies, {
            foreignKey: 'userId',
            as: 'userId'
          });
        },
      },
    });
  return Users;
};
