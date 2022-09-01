const express = require('express');

const routes = express.Router();

const usersRoutes = require('./users');
const loginRoutes = require('./login');
const vendorsRoutes = require('./vendors');
const productsRoutes = require('./products');
const collectionsRoutes = require('./collections');
const transactionsRoutes = require('./transactions');

routes.use('/users', usersRoutes);
routes.use('/login', loginRoutes);
routes.use('/vendors', vendorsRoutes);
routes.use('/products', productsRoutes);
routes.use('/collections', collectionsRoutes);
routes.use('/transactions', transactionsRoutes);

routes.get('/', (req, res) => {
  const mType = req.get('Content-Type');

  if (mType === 'application/json') {
    res.json({
      status: 'success',
      title: 'Bangunin',
      message: 'Bangunin',
    });
    return;
  }

  res.render('index', {
    title: 'Bangunin',
    message: 'Bangunin',
  });
});

module.exports = routes;
