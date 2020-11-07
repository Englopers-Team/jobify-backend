'use strict';
const express = require('express');
const router = express.Router();
const helper = require('../models/helper');

router.get('/jobs', async (req, res) => {
  console.log(helper.jobsApi());
  res.status(200).json(await helper.jobsApi());
});

router.get('/companies', async (req, res) => {
  res.status(200).json(await helper.companiesApi());
});

router.get('/employees', async (req, res) => {
  res.status(200).json(await helper.usersApi());
});

module.exports = router;
