

module.exports = (sequelize, DataTypes) => {
  const userIncidents = sequelize.define('userIncidents', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    incidentId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return userIncidents;
};
