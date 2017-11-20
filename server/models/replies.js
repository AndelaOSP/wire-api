'use strict';
module.exports = (sequelize, DataTypes) => {
  const Replies = sequelize.define('Replies', {
    reply: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Replies.belongsTo(models.Notes, {
        foreignKey: 'noteId',
        onDelete: 'CASCADE'
      });
        Notes.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  }
});
  return Replies;
};
