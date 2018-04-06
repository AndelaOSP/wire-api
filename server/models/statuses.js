
module.exports = (sequelize, DataTypes) => {
  const Statuses = sequelize.define('Statuses', {
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Statuses.hasMany(models.Incidents, {
          foreignKey: 'statusId',
          as: 'incidents'
        });
      }
    }
  });
  return Statuses;
};
