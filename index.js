'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
require('dotenv').config();
const mongoose = require('mongoose');

//---------------------------------// Import Resources \\-------------------------------\\
const client = require('./src/models/database');
const server = require('./src/server');

//--------------------------------// Esoteric Resources \\-------------------------------\\
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://messeili:MOMO0000@cluster0.zibi1.mongodb.net/jobify?retryWrites=true&w=majority' || 'mongodb://localhost:27017/jobify';
const PORT = process.env.PORT;

//--------------------------------// Server Connection \\--------------------------------\\
mongoose
  .connect(MONGODB_URI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    client
      .connect()
      .then(() => {
        server.start(PORT);
      })
      .catch((err) => {
        console.error(err.message);
      });
  });

//---------------------------------------------------------------------------------------\\
