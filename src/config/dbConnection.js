const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: 'mysql',
  host: process.env.DB_HOST || '0.0.0.0',
  port: process.env.DB_PORT || '3306',
  pool: {
    max: 1, // default: 5
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
