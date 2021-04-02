'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const express = require('express');

//---------------------------------// Import Resources \\-------------------------------\\
const authHelpers = require('../models/auth-helpers');
const basicAuth = require('../middleware/auth/authentication/basic-auth');
const bearerAuth = require('../middleware/auth/authentication/bearer-auth');
const linkedin = require('../middleware/auth/ouath/linkedin');
const google = require('../middleware/auth/ouath/google');
const passport = require('../middleware/auth/ouath/facebook');
const emailAuth = require('../middleware/auth/authentication/email-auth');

//-------------------------------// App Level Middleware \\-----------------------------\\
const router = express.Router();
router.use(passport.initialize());
router.use(passport.session());

//---------------------------------// Passport Handling\\-------------------------------\\
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

//--------------------------------------// Routes \\--------------------------------------\\
router.get('/verify/:token', emailAuth, async (req, res, next) => {
  try {
    if (req.accountStatus == 'pending') {
      let result = await authHelpers.verify(req.user, req.params.token);
      res.status(201).json(result);
    } else if (req.accountStatus == 'blocked') {
      res.status(201).json('blocked');
    } else if (req.accountStatus == 'active') {
      res.status(201).json('active');
    } else {
      res.status(201).json('guest');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/signup', (req, res) => {
  authHelpers
    .signup(req.body)
    .then(async (data) => {
      req.token = await authHelpers.generateToken(data);
      res.status(201).cookie('token', req.token).json({ token: req.token });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/signin', basicAuth, (req, res) => {
  console.log('test');
  res.status(202).cookie('token', req.token).send({ token: req.token });
});

router.get('/logout', (req, res) => {
  res.status(202).clearCookie('token').json('Logged out');
});

router.get('/test', bearerAuth, (req, res) => {
  res.status(200).send('test');
});

router.get('/oauth-linkedin', linkedin, (req, res) => {
  // res.status(200).cookie('token', req.token).json({ token: req.token, userinfo: req.user });
  res.redirect(`https://www.jobifys.com/oauth/${req.token}`);
});

router.get('/oauth-google', google, (req, res) => {
  // res.send('test',req.token);
  // res.status(200).cookie('token', req.token).json({ token: req.token, userinfo: req.user });
  res.redirect(`https://www.jobifys.com/oauth/${req.token}`);
});
router.get('/oauth-facebook', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
  // res.status(200).cookie('token', req.user.token).json({ token: req.user.token, userinfo: req.user });
  res.redirect(`https://www.jobifys.com/oauth/${req.user.token}`);
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/getinfo', bearerAuth, async (req, res) => {
  const data = await authHelpers.getInfo(req.user);
  res.status(200).json(data);
});

router.get('/getinfo/:id', bearerAuth, async (req, res) => {
  const data = await authHelpers.getInfoOther(req.params.id, req.user);
  res.status(200).json(data);

});

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = router;

//-----------------------------------------------------------------------------------------\\
