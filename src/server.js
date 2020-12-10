'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
require('dotenv').config();
const path = require('path');
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');

//---------------------------------// Import Resources \\-------------------------------\\
const notFoundHandler = require('./middleware/error/404');
const errorHandler = require('./middleware/error/500');
const bearerAuth = require('./middleware/auth/authentication/bearer-auth');
const authorize = require('./middleware/auth/authorization/authorize');

const communityRouter = require('./routes/community');
const companyRouter = require('./routes/company');
const homepageRouter = require('./routes/homepage');
const searchRouter = require('./routes/search');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');
const uploadRouter = require('./routes/upload');

//-------------------------------// App Level Middleware \\-----------------------------\\
const app = express();
const server = http.createServer(app);
app.use(cookieParser());
app.use(cors({
  origin: ['*'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(express.json());
// app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));

//--------------------------------// Socket Connection \\--------------------------------\\
const io = socketio(server);
const notification = io.of('/notification');
notification.on('connection', (socket) => {
  require('./socket.io/notification');
});
const messages = io.of('/messages');
messages.on('connection', (socket) => {
  require('./socket.io/messages');
});

//--------------------------------------// Routes \\--------------------------------------\\
app.use('/', homepageRouter);
app.use('/', authRouter);
app.use('/company', bearerAuth, authorize(['c']), companyRouter);
app.use('/user', bearerAuth, authorize(['p']), userRouter);
app.use('/search', searchRouter);
app.use('/community', bearerAuth, communityRouter);
app.use('/admin', bearerAuth, authorize(['admin', 'editor']), adminRouter);
app.use('/api/v1', apiRouter);
app.use('/upload', bearerAuth, uploadRouter);

//---------------------------------// Errors Middleware \\---------------------------------\\
app.use('*', notFoundHandler);
app.use(errorHandler);

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = {
  server: app,
  start: (port) => {
    server.listen(port, () => {
      console.log(`up and running on ${port}`);
    });
  },
  notifi: notification,
  messages : messages,
  io: io,
};

//-----------------------------------------------------------------------------------------\\







