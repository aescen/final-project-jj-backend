const express = require('express');
const { login } = require('../../controllers');

const loginRoutes = express.Router();

loginRoutes.post('/', login.addLogin);

module.exports = loginRoutes;
