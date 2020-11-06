'use strict';
const express = require('express');
const router = express.Router();
const authHelpers = require('../models/auth-helpers');
const basicAuth = require('../middleware/auth/authentication/basic-auth');
const bearerAuth = require('../middleware/auth/authentication/bearer-auth');

router.post('/signup', (req, res) => {
  authHelpers.signup(req.body).then((data) => {
    req.token = authHelpers.generateToken(data);
    res.status(201).cookie('token', req.token).json({ token: req.token });
  }).catch((err) => {
    res.status(500).json(err);
  });
});

router.post('/signin', basicAuth, (req, res) => {
  res.status(202).cookie('token', req.token).json({ token: req.token });
});

router.post('/logout', (req, res) => {
  res.status(202).clearCookie('token').json('Logged out');
});

router.get('/test',bearerAuth, (req, res) => {
  res.status(200).send('test');
});

// router.get('/oauth', (req, res) => {

// });

module.exports = router;