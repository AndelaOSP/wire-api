"use strict";
const schema = dataTypes => ({
  userId: { type: dataTypes.STRING, allowNull: false },
  incidentId: { type: dataTypes.STRING, allowNull: false },
  assignedRole: {
    type:   dataTypes.ENUM,
    values: ['ccd', 'assignee', 'other']
  }
});

module.exports = (sequelize, DataTypes) => {
  const userIncidents = sequelize.define("assigneeIncidents", schema(DataTypes));
  return userIncidents;
};
