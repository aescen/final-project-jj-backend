const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConnection');
const { UsersModel } = require('../index');

const VendorsModel = sequelize.define(
  'vendors',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    idUser: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: UsersModel,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    vendorName: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    linkedIn: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    bgExp: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

module.exports = VendorsModel;
