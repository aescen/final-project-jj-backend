const { UsersModel, VendorsModel } = require('../../models');

module.exports = {
  getAllVendors: async (req, res) => {
    const vendors = await VendorsModel.findAll({
      where: {
        isDeleted: false,
      },
      include: { all: true, nested: true },
    });

    const mappedVendors = vendors.map((item) => ({
      id: item.id,
      idUser: item.idUser,
      vendorName: item.vendorName,
      linkedIn: item.linkedIn,
      bgExp: item.bgExp,
    }));

    res.json({
      status: 'success',
      data: mappedVendors,
    });
  },
  getVendorById: async (req, res) => {
    const { id } = req.params;

    const vendorFound = await VendorsModel.findOne({
      where: {
        id,
      },
      include: { all: true, nested: true },
    });

    if (vendorFound === null) {
      res.status(404);
      res.json({
        status: 'error',
        message: 'Vendor tidak terdaftar.',
      });
      return;
    }

    const mappedVendor = {
      bgExp: vendorFound.bgExp,
      linkedIn: vendorFound.linkedIn,
      userStatus: vendorFound.userStatus,
      vendorName: vendorFound.vendorName,
    };

    res.json({
      status: 'success',
      vendor: mappedVendor,
    });
  },
  updateVendorById: async (req, res) => {
    const { idVendor: idVendorJwt } = req.jwt.decoded;
    const { id: vendorId } = req.params;

    if (idVendorJwt !== vendorId) {
      res.status(400);
      res.json({
        status: 'error',
        message: 'Id vendor tidak valid.',
      });
      return;
    }

    const {
      idUser, studioName: vendorName, linkedIn, bgExp,
    } = req.body;

    const users = await UsersModel.findAll({});

    const user = users.find((item) => item.id === idUser);

    if (!user) {
      res.status(400);
      res.json({
        status: 'error',
        message: 'User tidak diketahui.',
      });
      return;
    }

    const updatedVendorRow = await VendorsModel.update(
      {
        idUser,
        vendorName,
        linkedIn,
        bgExp,
      },
      {
        where: {
          id: vendorId,
        },
        include: { all: true, nested: true },
      },
    );

    if (updatedVendorRow[0] === 0) {
      res.status(404);
      res.json({
        status: 'error',
        message: 'Vendor tidak terdaftar.',
      });
      return;
    }

    res.json({
      status: 'success',
      message: 'Berhasil merubah data vendor.',
    });
  },
  deleteVendorById: async (req, res) => {
    const { idVendor: idVendorJwt } = req.jwt.decoded;
    const { id: vendorId } = req.params;

    if (idVendorJwt !== vendorId) {
      res.status(403);
      res.json({
        status: 'error',
        message: 'Id vendor tidak valid.',
      });
      return;
    }

    /* const deletedUserRow = await UsersModel.destroy({
      where: {
        id: userId,
      },
    }); */

    const deletedVendorRow = await VendorsModel.update(
      {
        isDeleted: true,
      },
      {
        where: {
          id: vendorId,
        },
      },
    );

    // if (!deletedUserRow) {
    if (deletedVendorRow[0] === 0) {
      res.status(404);
      res.json({
        status: 'error',
        message: 'Vendor tidak terdaftar.',
      });
      return;
    }

    res.json({
      status: 'success',
      message: 'Berhasil menghapus vendor.',
    });
  },
};
