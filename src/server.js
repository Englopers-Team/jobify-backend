'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`up and running on ${port}`);
    });
  },
};
