'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const express = require('express');

//---------------------------------// Import Resources \\-------------------------------\\
const user = require('../models/user');
const company = require('../models/company');
const bearerAuth = require('../middleware/auth/authentication/bearer-auth');
const authorize = require('../middleware/auth/authorization/authorize');

//-------------------------------// App Level Middleware \\-----------------------------\\
const router = express.Router();

//--------------------------------------// Routes \\--------------------------------------\\
router.get('/job', async (req, res) => {
  const data = await user.searchJob(req.query);
  res.status(200).json(data);
});

router.get('/company', async (req, res) => {
  const data = await user.searchCompany(req.query);
  res.status(200).json(data);
});

router.get('/employee', bearerAuth, authorize('c'), async (req, res) => {
  const data = await company.searchEmployee(req.query);
  res.status(200).json(data);
});

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = router;

//-----------------------------------------------------------------------------------------\\