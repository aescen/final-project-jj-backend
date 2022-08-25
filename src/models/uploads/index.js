const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConnection');

const UploadsModel = sequelize.define(
  'uploads',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    uid: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

module.exports = UploadsModel;
