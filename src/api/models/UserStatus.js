'use strict'

module.exports = (sequelize, DataTypes) => {
  const UserStatus = sequelize.define(
    'UserStatus',
    {
      name: {
        type: DataTypes.STRING,
        required: false
      },
      status: {
        type: DataTypes.INTEGER,
        required: false
      }
    },
    {
      freezeTableName: false,
      tableName: 'UserStatus'
    }
  )

  UserStatus.associate = function(models) {
    models.UserStatus.hasMany(models.User, {
      foreignKey: 'idUserStatus'
    })
  }

  return UserStatus
}
