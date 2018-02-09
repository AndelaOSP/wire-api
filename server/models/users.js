'use strict';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      primaryKey: true,
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
    name: {
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
          Users.hasMany(models.Witnesses, {
            foreignKey: 'userId',
            as: 'witnesses'
          });
          Users.hasMany(models.Assignees, {
            foreignKey: 'userId',
            as: 'assignees'
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
