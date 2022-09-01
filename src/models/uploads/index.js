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
    originalName: {
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
    uploadType: {
      type: DataTypes.ENUM('photos', 'design'),
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
