const Models = require('../../models');

module.exports = {
  addProduct: async (req, res) => {
    // set uploads
    const { designPhotos, designFiles } = req.formData;

    const photos = designPhotos.map((item) => ({
      originalName: item.originalName,
      fileName: item.name.replace(/\//g, ''),
      fileType: item.type,
      fileUrl: item.url,
      uploadType: 'photos',
    }));

    const design = designFiles.map((item) => ({
      originalName: item.originalName,
      fileName: item.name.replace(/\//g, ''),
      fileType: item.type,
      fileUrl: item.url,
      uploadType: 'design',
    }));

    const uploadsData = await Models.UploadsModel.bulkCreate([
      ...photos,
      ...design,
    ]);

    // set products

    const {
      productName,
      productType,
      productCollection,
      productDescription,
      productPrice,
      productStatus,
    } = req.formData;

    const product = {
      productName,
      productType,
      productCollection,
      productDescription,
      productPrice,
      productStatus: productStatus.toLowerCase().replace(/ /g, '_'),
    };

    const productData = await Models.ProductsModel.create(product);

    // set productsfiles

    const productFiles = uploadsData.map((file) => ({
      idProduct: productData.id,
      idFile: file.id,
    }));

    await Models.ProductFilesModel.bulkCreate(productFiles);

    // get vendor id

    const { id: idUserJwt } = req.jwt.decoded;

    const userFound = await Models.UsersModel.findOne({
      where: {
        id: idUserJwt,
      },
      include: [
        {
          model: Models.VendorsModel,
          required: true,
        },
      ],
    });

    const idVendor = userFound.vendor !== null ? userFound.vendor.id : undefined;

    // set collections

    const collection = {
      idProduct: productData.id,
      idVendor,
      collectionName: productCollection,
    };

    await Models.CollectionsModel.create(collection);

    const theProduct = {
      productName,
      productType,
      productCollection,
      productDescription,
      productPrice,
      productStatus,
      designPhotos: photos,
      designFiles: design,
    };

    res.json({
      status: 'success',
      data: theProduct,
    });
  },
};
