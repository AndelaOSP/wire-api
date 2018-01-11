'use strict';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: true,
    },
    names: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
    {
      classMethods: {
        associate: (models) => {
          Users.hasMany(models.Incidents, {
            foreignKey: 'userId',
            as: "incidents"
          });
          Users.hasMany(models.Notes, {
            foreignKey: 'userId',
            as: 'notes'
          });
          Users.hasMany(models.Chats, {
            foreignKey: 'userId',
            as: 'chats'
          });
          Users.belongsTo(models.Roles, {
            foreignKey: 'roleId',
            onDelete: 'CASCADE',
            allowNull: false
          });
        },
      },
    });
  return Users;
};
