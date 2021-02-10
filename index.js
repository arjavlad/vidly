const express = require('express');
const app = express();
const logger = require('./startup/logger');
require('./startup/config');
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on post ${port}`));
