'use strict';

const pg = require('pg');
require('dotenv').config();

module.exports =  new pg.Client(process.env.DATABASE_URL);
