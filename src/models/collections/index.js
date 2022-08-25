const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConnection');
const VendorsModel = require('../vendors');
const ProductsModel = require('../products');

const CollectionsModel = sequelize.define(
  'collections',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    idProduct: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: ProductsModel,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    idVendor: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: VendorsModel,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    collectionName: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

VendorsModel.hasMany(CollectionsModel, { foreignKey: 'id' });
CollectionsModel.belongsTo(VendorsModel, { foreignKey: 'idVendor' });

ProductsModel.hasMany(CollectionsModel, { foreignKey: 'id' });
CollectionsModel.belongsTo(ProductsModel, { foreignKey: 'idProduct' });

module.exports = CollectionsModel;
