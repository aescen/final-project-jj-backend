const jwt = require('jsonwebtoken');

const TokenManager = {
  generateAccessToken: (payload) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    jwt.sign(
      {
        ...payload,
      },
      process.env.ACCESS_TOKEN_KEY,
    ),

  verifyAccessToken: (authorization) => {
    try {
      return jwt.verify(authorization.split(' ')[1], process.env.ACCESS_TOKEN_KEY);
    } catch (err) {
      return undefined;
    }
  },
};

module.exports = TokenManager;
