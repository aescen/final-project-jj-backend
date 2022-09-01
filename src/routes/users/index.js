const express = require('express');
const { users } = require('../../controllers');
const { verifyJWT } = require('../common');

const usersRoutes = express.Router();

usersRoutes.post('/', users.addUser);
usersRoutes.get('/', users.getAllUsers);
usersRoutes.get('/:id', verifyJWT, users.getUserById);
usersRoutes.put('/:id', verifyJWT, users.updateUserById);
usersRoutes.delete('/:id', verifyJWT, users.deleteUserById);

module.exports = usersRoutes;
