const Models = require('../../models');

module.exports = {
  addTransaction: async (req, res) => {
    /**
     * * {
     * *   idUser: '',
     * *   idProduct: '',
     * *   recipientName: '',
     * *   recipientEmail: '',
     * *   phone: '',
     * *   paymentType: 'emoney', 'ccdc', 'vbank',
     * *   paymentStatus: 'failed', 'paid', 'pending',
     * *   paymentTimeout: DATE,
     * *   status:
     * *     'pending',
     * *     'timeout',
     * *     'on_process',
     * *     'rejected',
     * *     'completed',
     * * },
     */

    //* add transaction
    const {
      idUser,
      idProduct,
      quickBuyer,
      recipientName,
      recipientEmail,
      phone,
      paymentType,
    } = req.body;

    const date = new Date();
    date.setDate(date.getDate() + 1);

    const timeout = date.toISOString();

    const paymentStatus = 'pending';
    const paymentTimeout = timeout;
    const transactionStatus = 'on_process';

    const transaction = await Models.TransactionsModel.create({
      idUser,
      idProduct,
      quickBuyer,
      recipientName,
      recipientEmail,
      phone: phone || '',
      paymentType,
      paymentStatus,
      paymentTimeout,
      status: transactionStatus,
    });

    res.json({
      status: 'success',
      transaction,
    });
  },
  getTransactionById: async (req, res) => {
    const { id } = req.params;

    const collectionData = await Models.TransactionsModel.findOne({
      include: [
        {
          model: Models.TransactionsModel,
          required: false,
        },
      ],
      where: {
        '$product.id$': id,
      },
    });

    const productFile = await Models.TransactionFilesModel.findOne({
      include: [
        {
          model: Models.UploadsModel,
          required: false,
        },
      ],
      where: {
        idTransaction: id,
      },
    });

    const product = {
      productId: collectionData.idTransaction,
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
