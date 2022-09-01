const { RolesModel, UsersModel, VendorsModel } = require('../../models');
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

    console.log(email, password);

    const userFound = await UsersModel.findOne({
      where: {
        email,
      },
      include: [
        {
          model: VendorsModel,
          required: false,
        },
        {
          model: RolesModel,
          required: false,
        },
      ],
    });

    if (userFound === null) {
      res.status(400);
      res.json({
        status: 'error',
        message: 'Gagal login, user tidak ditemukan.',
      });
      return;
    }

    const idVendor = userFound.vendor !== null ? userFound.vendor.id : undefined;

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
        role: userFound.role.role,
      });

      res.json({
        status: 'success',
        accessToken,
        user: {
          id: userFound.id,
          idVendor,
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
