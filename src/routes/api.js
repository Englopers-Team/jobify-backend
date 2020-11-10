'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const express = require('express');

//---------------------------------// Import Resources \\-------------------------------\\
const helper = require('../models/helper');

//-------------------------------// App Level Middleware \\-----------------------------\\
const router = express.Router();

//--------------------------------------// Routes \\--------------------------------------\\
router.get('/jobs', async (req, res) => {
  res.status(200).json(await helper.jobsApi());
});

router.get('/companies', async (req, res) => {
  res.status(200).json(await helper.companiesApi());
});

router.get('/employees', async (req, res) => {
  res.status(200).json(await helper.usersApi());
});

router.get('/mockApi', async (req, res) => {
  let data = await helper.generateJobs(30);
  res.status(200).json({ data });
});

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = router;

//-----------------------------------------------------------------------------------------\\
