'use strict';
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    role: DataTypes.STRING,
    allowNull: false
  }, {
      classMethods: {
        associate: (models) => {
          Roles.hasMany(models.Users, {
            foreignKey: 'roleId',
            as: "users"
          });
        },
      }
    });
  return Roles;
};
