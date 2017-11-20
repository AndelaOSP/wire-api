'use strict';
module.exports = function(sequelize, DataTypes) {
  var Categories = sequelize.define('Categories', {
    status: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Categories;
};