const express = require('express');
const { products } = require('../../controllers');
const { verifyJWT, verifyAsVendor, parseFormData } = require('../common');

const postProductMiddlewares = [verifyJWT, verifyAsVendor, parseFormData];

const productsRoutes = express.Router();

productsRoutes.post('/', postProductMiddlewares, products.addProduct);
productsRoutes.get('/', products.getAllProducts);
productsRoutes.get('/:id', products.getProductById);

module.exports = productsRoutes;
