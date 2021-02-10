
const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = function () {
  mongoose.set('useFindAndModify', false);
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useCreateIndex', true);
  mongoose.connect('mongodb://localhost/vidly').then(() => logger.info('Connected to MongoDB'));
};
