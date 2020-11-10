'use strict';
const express = require('express');
const helper = require('../models/helper');
const router = express.Router();
const user = require('../models/user');

router.get('/app', async (req, res) => {
  const data = await user.userApps(req.user);
  res.status(200).json(data);
});

router.get('/saved', async (req, res) => {
  const data = await user.savedJobs(req.user);
  res.status(200).json(data);
});

router.post('/save', async (req, res, next) => {
  try {
    const data = await user.saveJob(req.user, req.body);
    res.status(201).json(data);
  } catch (err) {
    next(`Can't save app`);
  }
});

router.get('/app/:id', async (req, res, next) => {
  try {
    const data = await user.userApp(req.user, req.params.id);
    res.status(200).json(data);
  } catch (err) {
    next(`Can't show app`);
  }
});
router.delete('/app/:id', async (req, res, next) => {
  try {
    await user.deleteApp(req.user, req.params.id);
    res.status(202).json('Deleted app');
  } catch (err) {
    next(`Can't delete app`);
  }
});

router.get('/offers', async (req, res) => {
  const data = await user.userOffers(req.user);
  res.status(200).json(data);
});

router.put('/offers/:id', async (req, res,next) => {
  try{
    await user.answerOffer(req.user,req.params.id, req.body.status);
    res.status(201).json({});
  }catch(err){
    next(err);
  }
});

router.put('/edit', async (req, res) => {
  await user.editProfile(req.user, req.body);
  res.status(201).json({});
});

router.post('/apply/:id', async (req, res) => {
  if (req.body.api) {
    await user.applyAPI(req.user, req.body);
    res.status(201).json({});
  } else {
    await user.applyDB(req.user, { jobID: req.params.id, companyID: req.body.company_id });
    res.status(201).json({});
  }
  
});

// router.post('/sendReport', async (req, res) => {
//   // console.log(req.body);
//   await helper.sendReport(req.user, req.body);
//   res.status(201).json({});
// });

module.exports = router;
