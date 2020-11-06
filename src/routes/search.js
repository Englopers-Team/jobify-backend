'use strict';
const express = require('express');
const router = express.Router();
const user = require('../models/user');
const company = require('../models/company');
const bearerAuth = require('../middleware/auth/authentication/bearer-auth');
const authorize = require('../middleware/auth/authorization/authorize');

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

module.exports = router;