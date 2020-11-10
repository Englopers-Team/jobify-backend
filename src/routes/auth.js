'use strict';
const express = require('express');
const router = express.Router();
const authHelpers = require('../models/auth-helpers');
const basicAuth = require('../middleware/auth/authentication/basic-auth');
const bearerAuth = require('../middleware/auth/authentication/bearer-auth');
const linkedin = require('../middleware/auth/ouath/linkedin');
const google = require('../middleware/auth/ouath/google');
const passport = require('../middleware/auth/ouath/facebook');
const emailAuth = require('../middleware/auth/authentication/email-auth');

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

router.get('/verify/:token', emailAuth, async (req, res,next) => {
  try {
    let result = await authHelpers.verify(req.user, req.params.token);
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
});

router.post('/signup', (req, res) => {
  authHelpers
    .signup(req.body)
    .then((data) => {
      req.token = authHelpers.generateToken(data);
      res.status(201).cookie('token', req.token).json({ token: req.token });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/signin', basicAuth, (req, res) => {
  res.status(202).cookie('token', req.token).send({ token: req.token });
});

router.get('/logout', (req, res) => {
  res.status(202).clearCookie('token').json('Logged out');
});

router.get('/test', bearerAuth, (req, res) => {
  res.status(200).send('test');
});

router.get('/oauth-linkedin', linkedin, (req, res) => {
  res.status(200).cookie('token', req.token).json({ token: req.token, userinfo: req.user });
});

router.get('/oauth-google', google, (req, res) => {
  res.status(200).cookie('token', req.token).json({ token: req.token, userinfo: req.user });
});
router.get('/oauth-facebook', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
  // console.log('req', req.user);
  res.status(200).cookie('token', req.user.token).json({ token: req.user.token, userinfo: req.user });
});

router.get('/auth/facebook', passport.authenticate('facebook'));
module.exports = router;
