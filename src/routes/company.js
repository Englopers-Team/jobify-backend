'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const express = require('express');

//---------------------------------// Import Resources \\-------------------------------\\
const company = require('../models/company');

//-------------------------------// App Level Middleware \\-----------------------------\\
const router = express.Router();

//--------------------------------------// Routes \\--------------------------------------\\
router.get('/jobs', async (req, res) => {
  const data = await company.jobs(req.user);
  res.status(200).json(data);
});

router.get('/jobs/:id', async (req, res) => {
  const data = await company.jobs(req.user, req.params.id);
  res.status(200).json(data);
});

router.put('/jobs/:id', async (req, res, next) => {
  try {
    await company.editJob(req.user, req.params.id, req.body);
    res.status(202).json('Job updated successfully');
  } catch (err) {
    next(err);
  }
});

router.delete('/jobs/:id', async (req, res, next) => {
  try {
    await company.deleteJob(req.user, req.params.id);
    res.status(202).json('Job deleted successfully');
  } catch (err) {
    next(err);
  }
});

router.post('/submit', async (req, res) => {
  await company.submitJob(req.user, req.body);
  res.status(201).json('Job submitted successfully');
});

router.get('/app', async (req, res) => {
  let data = await company.companyApps(req.user);
  res.status(200).json(data);
});

router.get('/app/:id', async (req, res) => {
  let data = await company.companySingleApp(req.params.id);
  res.status(200).json(data);
});

router.put('/app/:id', async (req, res, next) => {
  try {
    await company.answerApp(req.user, req.params.id, req.body.status);
    res.status(202).json('App answered successfully');
  } catch (err) {
    next(err);
  }
});

router.get('/offers', async (req, res) => {
  let data = await company.companyOffers(req.user);
  res.status(200).json(data);
});

router.post('/offers/:id', async (req, res) => {
  await company.sendOffer(req.user, req.params.id, req.body);
  res.status(201).json('Offer sent successfully');
});

router.delete('/offers/:id', async (req, res, next) => {
  try {
    await company.deleteOffer(req.user, req.params.id);
    res.status(202).json('Offer deleted successfully');
  } catch (err) {
    next(err);
  }
});

router.put('/edit', async (req, res) => {
  await company.editProfile(req.user, req.body);
  res.status(202).json('Profile updated successfully');
});

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = router;

//-----------------------------------------------------------------------------------------\\
