'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const express = require('express');

//---------------------------------// Import Resources \\-------------------------------\\
const company = require('../models/company');
const user = require('../models/user');
const bearerAuth = require('../middleware/auth/authentication/bearer-auth');
const helper = require('../models/helper');
const authorize = require('../middleware/auth/authorization/authorize');
const location = require('../middleware/location');

//-------------------------------// App Level Middleware \\-----------------------------\\
const router = express.Router();

//--------------------------------------// Routes \\--------------------------------------\\
router.get('/home', bearerAuth, async (req, res, next) => {
  try {
    let data;
    if (req.user.account_type === 'p') {
      data = await user.dashboard(req.user);
    } else if (req.user.account_type === 'c') {
      data = await company.dashboard(req.user);
    }
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/report', bearerAuth, async (req, res, next) => {
  try {
    await helper.sendReport(req.user, req.body);
    res.status(201).json('Report sent successfully');
  } catch (err) {
    next(`Can't send report`);
  }
});
router.get('/reports', bearerAuth, async (req, res) => {
  const data = await helper.reports(req.user);
  res.status(200).json(data);
});

router.get('/report/:id', bearerAuth, async (req, res) => {
  const data = await helper.report(req.user, req.params.id);
  res.status(200).json(data);
});

router.get('/test500', () => {
  throw new Error('500');
});

router.get('/testAuthorize', authorize(['p']), (req, res) => {
  res.status(200).json('worked');
});

router.get('/flag', location, async (req, res) => {
  const data = await helper.flag(req.ipAddress);
  res.status(200).json(data);
});

router.get('/meetings', bearerAuth, async (req, res) => {
  const data = await helper.getMeetings(req.user);
  res.status(200).json(data);
});

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = router;

//-----------------------------------------------------------------------------------------\\
