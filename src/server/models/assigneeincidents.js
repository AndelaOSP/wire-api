

module.exports = (sequelize, DataTypes) => {
  const assigneeIncidents = sequelize.define('assigneeIncidents', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    incidentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assignedRole: {
      type: DataTypes.ENUM,
      values: ['ccd', 'assignee', 'other']
    }
  });
  return assigneeIncidents;
};
