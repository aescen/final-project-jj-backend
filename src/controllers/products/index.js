const Models = require('../../models');
const { flatDeep } = require('../../utils');

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
          required: false,
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
  getAllProducts: async (req, res) => {
    const collectionsData = await Models.CollectionsModel.findAll({
      include: [
        {
          model: Models.ProductsModel,
          required: false,
        },
      ],
      where: {
        '$product.product_status$': 'on_listing',
      },
    });

    const productFiles = await Models.ProductFilesModel.findAll({
      include: [
        {
          model: Models.UploadsModel,
          required: false,
        },
      ],
    });

    const photosUrl = new Map();
    productFiles.forEach((item) => {
      if (item.upload.uploadType !== 'design') {
        const { fileUrl } = item.upload;
        if (photosUrl.has(item.idProduct)) {
          photosUrl.set(item.idProduct, [
            ...photosUrl.get(item.idProduct),
            fileUrl,
          ]);
          return;
        }

        photosUrl.set(item.idProduct, [fileUrl]);
      }
    });

    const collections = new Map();
    collectionsData.forEach((item) => {
      const idProduct = item.product.id;

      // collection name
      const { collectionName } = item;

      // products
      const product = {
        productId: idProduct,
        productName: item.product.productName,
        productCollection: item.product.productCollection,
        productType: item.product.productType,
        productDescription: item.product.productDescription,
        // productFeatures: item.product.productFeatures.split(', '),
        productPrice: item.product.productPrice,
        productStatus: item.product.productStatus
          .replace(/_/g, ' ')
          .toUpperCase(),
        designPhotos: [],
      };

      // arrange
      if (photosUrl.has(idProduct)) {
        product.designPhotos = photosUrl.get(idProduct);
      }

      if (collections.has(collectionName)) {
        const products = collections.get(collectionName);
        collections.set(collectionName, [...products, product]);

        return;
      }

      collections.set(collectionName, [product]);
    });

    // eslint-disable-next-line no-unused-vars
    const products = flatDeep(Array.from(collections, ([key, value]) => value));

    res.json({
      status: 'success',
      data: products,
    });
  },
  getProductById: async (req, res) => {
    const { id } = req.params;

    const collectionData = await Models.CollectionsModel.findOne({
      include: [
        {
          model: Models.ProductsModel,
          required: false,
        },
      ],
      where: {
        '$product.id$': id,
      },
    });

    const productFile = await Models.ProductFilesModel.findOne({
      include: [
        {
          model: Models.UploadsModel,
          required: false,
        },
      ],
      where: {
        idProduct: id,
      },
    });

    const product = {
      productId: collectionData.idProduct,
      productName: collectionData.product.productName,
      productCollection: collectionData.product.productCollection,
      productType: collectionData.product.productType,
      productDescription: collectionData.product.productDescription,
      // productFeatures: collectionData.product.productFeatures.split(', '),
      productPrice: collectionData.product.productPrice,
      productStatus: collectionData.product.productStatus
        .replace(/_/g, ' ')
        .toUpperCase(),
      designPhotos: [productFile.upload.fileUrl],
    };

    res.json({
      status: 'success',
      product,
    });
  },
};
