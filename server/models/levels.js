'use strict';
module.exports = (sequelize, DataTypes) => {
  const Levels = sequelize.define('Levels', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Levels.hasMany(models.Levels, {
        foreignKey: 'levelId',
        as: 'categories'
      })
    }
  }
});
  return Levels;
};
