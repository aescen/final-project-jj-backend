const { UsersModel } = require('../../models');
const { TokenManager, BCryptPassword } = require('../../utils');

module.exports = {
  addLogin: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      res.json({
        status: 'error',
        message: 'Gagal login, data tidak lengkap.',
      });
      return;
    }

    const userFound = await UsersModel.findOne({
      where: {
        email,
      },
      include: { all: true, nested: true },
    });

    const idVendor = userFound.vendor !== null ? userFound.vendor.vendor : undefined;

    console.log(await BCryptPassword.hash(password));

    const passwordMatch = await BCryptPassword.comparePassword(
      password, // password
      userFound.password, // hashedPassword
    );

    if (!userFound || !passwordMatch) {
      res.status(400);
      res.json({
        status: 'error',
        message: 'Gagal login, email atau password salah.',
      });
      return;
    }

    try {
      const accessToken = TokenManager.generateAccessToken({
        id: userFound.id,
        idVendor,
        role: userFound.role.role,
      });

      res.json({
        status: 'success',
        accessToken,
        user: {
          id: userFound.id,
          firstName: userFound.firstName,
          lastName: userFound.lastName || '',
          email: userFound.email,
          phone: userFound.phone || '',
          avatarUrl: userFound.avatarUrl || '',
          userStatus: userFound.userStatus,
          role: userFound.role.role,
        },
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
};
