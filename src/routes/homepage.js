'use strict';
const express = require('express');
const router = express.Router();
const company = require('../models/company');
const user = require('../models/user');
const bearerAuth = require('../middleware/auth/authentication/bearer-auth');
const helper = require('../models/helper');
const authorize = require('../middleware/auth/authorization/authorize');

router.get('/a', bearerAuth, async (req, res) => {
  let data;
  if (req.user.account_type === 'p') {
    data = await user.dashboard(req.user);
  } else if (req.user.account_type === 'c') {
    data = await company.dashboard(req.user);
  }
  res.status(200).json(data);
});

router.post('/report', bearerAuth, async (req, res, next) => {
  try {
    await helper.sendReport(req.user, req.body);
    res.status(201).json({});
  } catch (err) {
    next(`Can't send report`);
  }
});
router.get('/report', bearerAuth, async (req, res) => {
  const data = await helper.reports(req.user);
  res.status(200).json(data);
});

router.get('/test500',()=>{
  throw new Error('500');
});

router.get('/testAuthorize',authorize(['p']),(req,res)=>{
  res.status(200).json('worked');
});



module.exports = router;
