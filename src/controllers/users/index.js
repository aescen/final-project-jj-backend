const { RolesModel, UsersModel, VendorsModel } = require('../../models');
const { BCryptPassword } = require('../../utils');

module.exports = {
  addUser: async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      avatarUrl,
      role,
      studioName: vendorName,
      linkedIn,
      bgExp,
    } = req.body;

    const roles = await RolesModel.findAll({});

    const userRole = roles.find((item) => item.role === role);

    if (!userRole) {
      res.status(400);
      res.json({
        status: 'error',
        message: 'Role tidak diketahui.',
      });
      return;
    }

    const userFound = await UsersModel.findOne({
      where: {
        email,
      },
      include: { all: true, nested: true },
    });

    if (userFound !== null && !userFound.isDeleted) {
      res.status(400);
      res.json({
        status: 'error',
        message: 'User sudah ada.',
      });
      return;
    }

    const hashedPassword = await BCryptPassword.hash(password);

    let addedUser = await UsersModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      avatarUrl,
      userStatus: role === 'user' ? 'active' : 'frozen',
      idRole: userRole.id,
    });

    let vendor;
    if (role === 'vendor') {
      const addedVendor = await VendorsModel.create({
        idUser: addedUser.id,
        vendorName,
        linkedIn,
        bgExp,
      });

      await UsersModel.update(
        {
          idVendor: addedVendor.id,
        },
        {
          where: {
            id: addedUser.id,
          },
        },
      );

      addedUser = await UsersModel.findOne({
        where: {
          id: addedUser.id,
        },
        include: { all: true, nested: true },
      });

      vendor = {
        studioName: addedUser.vendor.vendorName,
        linkedIn: addedUser.vendor.linkedIn,
        bgExp: addedUser.vendor.bgExp,
      };
    }

    res.status(201);
    res.json({
      status: 'success',
      data: {
        id: addedUser.id,
        firstName: addedUser.firstName,
        lastName: addedUser.lastName || '',
        email: addedUser.email,
        phone: addedUser.phone || '',
        userStatus: addedUser.userStatus,
        avatarUrl: addedUser.avatarUrl || '',
        role: userRole.role,
        vendor,
      },
    });
  },
  getAllUsers: async (req, res) => {
    const users = await UsersModel.findAll({
      where: {
        isDeleted: false,
      },
      include: { all: true, nested: true },
    });

    const mappedUsers = users.map((item) => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName || '',
      email: item.email,
      phone: item.phone || '',
      avatarUrl: item.avatarUrl || '',
      userStatus: item.userStatus,
      role: item.role.role,
    }));

    res.json({
      status: 'success',
      data: mappedUsers,
    });
  },
  getUserById: async (req, res) => {
    const { id: userId } = req.params;
    const userFound = await UsersModel.findOne({
      where: {
        id: userId,
      },
      include: { all: true, nested: true },
    });

    if (userFound === null) {
      res.status(404);
      res.json({
        status: 'error',
        message: 'User tidak terdaftar.',
      });
      return;
    }

    res.json({
      status: 'success',
      user: userFound,
    });
  },
  updateUserById: async (req, res) => {
    const { id: idJwt } = req.jwt.decoded;
    const { id: userId } = req.params;

    if (idJwt !== userId) {
      res.status(403);
      res.json({
        status: 'error',
        message: 'Anda tidak memiliki hak akses.',
      });
      return;
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      avatarUrl,
      userStatus,
      role,
    } = req.body;

    const roles = await RolesModel.findAll({});

    const userRole = roles.find((item) => item.role === role);

    if (!userRole) {
      res.status(400);
      res.json({
        status: 'error',
        message: 'Role tidak diketahui.',
      });
      return;
    }

    const hashedPassword = await BCryptPassword.hash(password);

    const updatedUserRow = await UsersModel.update(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        avatarUrl,
        userStatus,
        idRole: userRole.id,
      },
      {
        where: {
          id: userId,
        },
        include: { all: true, nested: true },
      },
    );

    if (updatedUserRow[0] === 0) {
      res.status(404);
      res.json({
        status: 'error',
        message: 'User tidak terdaftar.',
      });
      return;
    }

    res.json({
      status: 'success',
      message: 'Berhasil merubah data user.',
    });
  },
  deleteUserById: async (req, res) => {
    const { id: idJwt } = req.jwt.decoded;
    const { id: userId } = req.params;

    if (idJwt !== userId) {
      res.status(403);
      res.json({
        status: 'error',
        message: 'Anda tidak memiliki hak akses.',
      });
      return;
    }

    /* const deletedUserRow = await UsersModel.destroy({
      where: {
        id: userId,
      },
    }); */

    const deletedUserRow = await UsersModel.update(
      {
        isDeleted: true,
      },
      {
        where: {
          id: userId,
        },
      },
    );

    // if (!deletedUserRow) {
    if (deletedUserRow[0] === 0) {
      res.status(404);
      res.json({
        status: 'error',
        message: 'User tidak terdaftar.',
      });
      return;
    }

    res.json({
      status: 'success',
      message: 'Berhasil menghapus user.',
    });
  },
};
