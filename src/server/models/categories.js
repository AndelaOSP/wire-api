
module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define('Categories', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Categories.hasMany(models.Incidents, {
          foreignKey: 'categoryId',
          as: 'incidents'
        });
        Categories.belongsTo(models.Levels, {
          foreignKey: 'levelId',
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return Categories;
};
