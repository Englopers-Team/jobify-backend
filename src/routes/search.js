'use strict';
const express = require('express');
const router = express.Router();
const user = require('../models/user');
const company = require('../models/company');

router.get('/job', async (req, res) => {
  const data = await user.searchJob(req.query);
  res.status(200).json(data);
});

router.get('/company', async (req, res) => {
  const data = await user.searchCompany(req.query);
  res.status(200).json(data);
});

router.get('/employee', async (req, res) => {
  const data = await company.searchEmployee(req.query);
  res.status(200).json(data);
});

module.exports = router;