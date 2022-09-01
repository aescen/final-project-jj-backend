const express = require('express');
const { vendors } = require('../../controllers');
const { verifyJWT } = require('../common');

const vendorsRoutes = express.Router();

vendorsRoutes.get('/', verifyJWT, vendors.getAllVendors);
vendorsRoutes.get('/:id', verifyJWT, vendors.getVendorById);
vendorsRoutes.put('/:id', verifyJWT, vendors.updateVendorById);
vendorsRoutes.delete('/:id', verifyJWT, vendors.deleteVendorById);

module.exports = vendorsRoutes;
