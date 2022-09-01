const busboy = require('busboy');
const { TokenManager } = require('../utils');
const { GCStorage } = require('../utils');

const DESIGN_PATH = 'designs';
const IMAGES_PATH = 'images';

module.exports = {
  verifyJWT: (req, res, next) => {
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
  },
  verifyJWTOrAnon: (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      req.anon = true;
      next();
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
  },
  verifyAsVendor: (req, res, next) => {
    const { role: roleJwt } = req.jwt.decoded;

    if (roleJwt !== 'vendor') {
      res.status(403);
      res.json({
        status: 'error',
        message: 'Anda tidak memiliki hak akses.',
      });
      return;
    }
    next();
  },
  verifyAsUser: (req, res, next) => {
    if (req.anon) {
      next();
      return;
    }

    const { role: roleJwt } = req.jwt.decoded;

    if (roleJwt !== 'user') {
      res.status(403);
      res.json({
        status: 'error',
        message: 'Anda tidak memiliki hak akses.',
      });
      return;
    }
    next();
  },
  parseFormData: (req, res, next) => {
    const bb = busboy({ headers: req.headers });
    req.formData = {};
    req.filesCount = 0;
    req.pipe(bb);

    const onFinish = () => {
      if (!res.finished && !bb.writeable && req.filesCount === 0) {
        next();
      }
    };

    bb.on('file', async (name, file, info) => {
      const { filename, mimeType } = info;
      req.filesCount += 1;

      const type = mimeType.split('/')[1];
      const path = type === 'zip' ? DESIGN_PATH : IMAGES_PATH;

      try {
        const objectData = await GCStorage.uploadFile(file, type, path);

        objectData.originalName = filename;
        objectData.mimeType = mimeType;

        const filesProp = name.replace(/\[\]/g, '');
        const files = [objectData];

        if (req.formData[filesProp]) {
          files.push(...req.formData[filesProp]);
        }

        req.formData = {
          ...req.formData,
          [filesProp]: files,
        };

        req.filesCount -= 1;
        onFinish();
      } catch (error) {
        // if (error.name === 'FetchError') {
        //   console.log('fetch error');
        // }

        res.status(500);
        res.json({
          status: 'error',
          message: 'Gagal menyimpan berkas.',
        });
        res.end();
      }
    });

    bb.on('field', (name, val) => {
      const fieldProp = name.replace(/\[\]/g, '');

      req.formData = {
        ...req.formData,
        [fieldProp]: val,
      };
    });

    bb.on('finish', onFinish);
  },
};
