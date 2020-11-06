'use strict';

require('dotenv').config();
const client = require('./src/models/database');
const server = require('./src/server');
const PORT = process.env.PORT;
client.connect().then(() => {
  server.start(PORT);
});
