const Models = require('../../models');

module.exports = {
  getAllCollections: async (req, res) => {
    const collections = await Models.CollectionsModel.findAll({
      include: [
        {
          model: Models.ProductsModel,
          required: true,
        },
      ],
    });

    const productFiles = await Models.ProductFilesModel.findAll({
      include: [
        {
          model: Models.UploadsModel,
          required: true,
        },
        {
          model: Models.ProductsModel,
          required: true,
        },
      ],
    });

    console.log(JSON.stringify(collections, null, 2));
    console.log(JSON.stringify(productFiles, null, 2));

    // const mappedcollections = collections.map((item) => ({
    //   id: item.id,
    //   firstName: item.firstName,
    //   lastName: item.lastName || '',
    //   email: item.email,
    //   phone: item.phone || '',
    //   avatarUrl: item.avatarUrl || '',
    //   userStatus: item.userStatus,
    //   role: item.role.role,
    // }));

    res.json({
      status: 'success',
      data: [],
    });
  },
};
