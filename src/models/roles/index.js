const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConnection');

const RolesModel = sequelize.define(
  'roles',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'user', 'vendor'),
      defaultValue: 'user',
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['role'],
      },
    ],
  },
);

module.exports = RolesModel;
