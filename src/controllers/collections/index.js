const Models = require('../../models');

module.exports = {
  getAllCollections: async (req, res) => {
    const collectionsData = await Models.CollectionsModel.findAll({
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
        const { products } = collections.get(collectionName);
        collections.set(collectionName, {
          collectionName,
          products: [...products, product],
        });

        return;
      }

      collections.set(collectionName, {
        collectionName,
        products: [product],
      });
    });

    // eslint-disable-next-line no-unused-vars
    const mappedCollections = Array.from(collections, ([key, value]) => value);
    // console.log(JSON.stringify(mappedCollections, null, 2));

    res.json({
      status: 'success',
      data: mappedCollections,
    });
  },
};
