'use strict';
const pg = require('pg');
const server = require('./src/server');
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT;
require('dotenv').config();
client.connect().then(() => {
  server.start(PORT);
});
