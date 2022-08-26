const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConnection');
const UploadsModel = require('../uploads');
const ProductsModel = require('../products');

const ProductFilesModel = sequelize.define(
  'productfiles',
  {
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
    idFile: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: UploadsModel,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

ProductFilesModel.removeAttribute('id');

ProductsModel.hasMany(ProductFilesModel, { foreignKey: 'id' });
ProductFilesModel.belongsTo(ProductsModel, { foreignKey: 'idProduct' });

UploadsModel.hasMany(ProductFilesModel, { foreignKey: 'id' });
ProductFilesModel.belongsTo(UploadsModel, { foreignKey: 'idFile' });

module.exports = ProductFilesModel;
