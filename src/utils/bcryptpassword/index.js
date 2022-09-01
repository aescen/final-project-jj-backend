const bcrypt = require('bcrypt');

const BCryptPassword = {
  hash: async (password, saltRound = 10) => bcrypt.hash(password, saltRound),
  comparePassword: async (password, hashedPassword) => bcrypt.compare(password, hashedPassword),
};

module.exports = BCryptPassword;
