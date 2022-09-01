const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConnection');
const UsersModel = require('../users');
const ProductsModel = require('../products');

const TransactionsModel = sequelize.define(
  'transactions',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    idUser: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: UsersModel,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    quickBuyer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    recipientName: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    recipientEmail: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    paymentType: {
      type: DataTypes.ENUM('emoney', 'ccdc', 'vbank'),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM('failed', 'paid', 'pending'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentTimeout: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'timeout',
        'on_process',
        'rejected',
        'completed',
      ),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

UsersModel.hasMany(TransactionsModel, { foreignKey: 'id' });
TransactionsModel.belongsTo(UsersModel, { foreignKey: 'idUser' });

ProductsModel.hasMany(TransactionsModel, { foreignKey: 'id' });
TransactionsModel.belongsTo(ProductsModel, { foreignKey: 'idProduct' });

module.exports = TransactionsModel;
