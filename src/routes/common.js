const { TokenManager } = require('../utils');

const verifyJWT = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(400);
    res.json({
      status: 'error',
      message: 'Gagal memuat data. Token tidak ada',
    });
    return;
  }

  try {
    const decoded = TokenManager.verifyAccessToken(authorization);

    if (decoded) {
      req.jwt = {
        decoded,
      };
      next();
      return;
    }

    res.status(401);
    res.json({
      status: 'error',
      message: 'Gagal memuat data. Token anda tidak valid.',
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({
      status: 'error',
      message: 'Terjadi kegagalan di server kami',
    });
  }
};

module.exports = { verifyJWT };
