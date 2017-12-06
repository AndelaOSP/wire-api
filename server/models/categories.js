'use strict';
module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define('Categories', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Categories.hasMany(models.Incidents, {
        foreignKey: 'categoryId',
        as: 'categories'
      })
      Categories.belongsTo(models.Levels, {
        foreignKey: 'levelId',
        onDelete: 'CASCADE'
      })
    }
  }
});
  return Categories;
};
