const express = require('express');
const { products } = require('../../controllers');
const { verifyJWT } = require('../common');

const productsRoutes = express.Router();

productsRoutes.post('/', verifyJWT, products.addProduct);

module.exports = productsRoutes;
