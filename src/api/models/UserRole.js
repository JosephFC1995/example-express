'use strict'

module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
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
      tableName: 'UserRole'
    }
  )

  UserRole.associate = function(models) {
    models.UserRole.hasMany(models.User, { foreignKey: 'idUserRole' })
  }

  return UserRole
}
