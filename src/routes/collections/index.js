const express = require('express');
const { collections } = require('../../controllers');
const { verifyJWT, verifyAsVendor } = require('../common');

const collectionsRoutes = express.Router();

const collectionsMiddleware = [verifyJWT, verifyAsVendor];

collectionsRoutes.get(
  '/',
  collectionsMiddleware,
  collections.getAllCollections,
);

module.exports = collectionsRoutes;
