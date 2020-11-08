'use strict';
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://heroku:heroku1337@cluster0.1i1ry.mongodb.net/jobify?retryWrites=true&w=majority' || 'mongodb://localhost:27017/jobify';
const mongoose = require('mongoose');
const client = require('./src/models/database');
const server = require('./src/server');
const PORT = process.env.PORT;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(()=>{
  client.connect().then(() => {
    server.start(PORT);
  }).catch((err) => {
    console.error(err.message);
  });
});