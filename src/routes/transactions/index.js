const express = require('express');
const { transactions } = require('../../controllers');
const { verifyJWTOrAnon, verifyAsUser } = require('../common');

const transactionsRoutes = express.Router();

const transactionsMiddleware = [verifyJWTOrAnon, verifyAsUser];

transactionsRoutes.post(
  '/',
  transactionsMiddleware,
  transactions.addTransaction,
);

module.exports = transactionsRoutes;
