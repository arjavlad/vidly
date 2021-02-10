const logger = require('../startup/logger');

module.exports = function (err, req, res, next) {
  logger.error(err.message, err);
  return res.status(500).send('something failed');
};
