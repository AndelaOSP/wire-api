
module.exports = (sequelize, DataTypes) => {
  const Witnesses = sequelize.define('Witnesses', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    incidentId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return Witnesses;
};
