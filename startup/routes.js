const express = require('express');
require('express-async-errors');

const authenticator = require('../routes/auth');
const home = require('../routes/home');
const auth = require('../routes/auth');
const users = require('../routes/users');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const error = require('../middleware/error');

module.exports = function (app) {
  app.set('view engine', 'pug');
  app.set('views', './views');

  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));

  app.use('/', home);
  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use(error);
};
