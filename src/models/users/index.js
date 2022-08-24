const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConnection');
const RolesModel = require('../roles');
const VendorsModel = require('../vendors');

const UsersModel = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    userStatus: {
      type: DataTypes.ENUM('frozen', 'active'),
      defaultValue: 'frozen',
    },
    idRole: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: RolesModel,
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    idVendor: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: VendorsModel,
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
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

RolesModel.hasMany(UsersModel, { foreignKey: 'id' });
UsersModel.belongsTo(RolesModel, { foreignKey: 'idRole' });

UsersModel.belongsTo(VendorsModel, { foreignKey: 'idVendor', targetKey: 'id' });

// cyclic references problem must be placed here
VendorsModel.belongsTo(UsersModel, { foreignKey: 'idUser', targetKey: 'id' });

module.exports = UsersModel;
