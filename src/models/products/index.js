const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConnection');

const ProductsModel = sequelize.define(
  'products',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    productName: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    productType: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    productCollection: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    productDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    productPrice: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    productStatus: {
      type: DataTypes.ENUM('on_listing', 'off_listing', 'deleted'),
      defaultValue: 'on_listing',
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

module.exports = ProductsModel;
