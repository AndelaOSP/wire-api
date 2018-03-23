
const schema = dataTypes => ({
  userId: { type: dataTypes.STRING, allowNull: false },
  incidentId: { type: dataTypes.STRING, allowNull: false }
});

module.exports = (sequelize, DataTypes) => {
  const userIncidents = sequelize.define('userIncidents', schema(DataTypes));
  return userIncidents;
};
