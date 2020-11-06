'use strict';
const express = require('express');
const router = express.Router();
const company = require('../models/company');
const user = require('../models/user');
const bearerAuth = require('../middleware/auth/authentication/bearer-auth');


router.get('/', bearerAuth, async (req, res) => {
  let data;
  if (req.user.account_type === 'p') { data = await user.dashboard(req.user); }
  else if (req.user.account_type === 'c') { data = await company.dashboard(req.user); }
  res.status(200).json(data);
});

router.post('/report', bearerAuth, async (req, res) => {
  if (req.user.account_type === 'p') { await user.sendReport(req.user, req.body); }
  else if (req.user.account_type === 'c') { await company.sendReport(req.user, req.body); }
  res.status(201).json({});
});

module.exports = router;