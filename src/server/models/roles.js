
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Roles.hasMany(models.Users, {
          foreignKey: 'roleId',
          as: 'users'
        });
      },
    }
  });
  return Roles;
};
