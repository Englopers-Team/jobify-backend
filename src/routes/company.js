'use strict';
const express = require('express');
const router = express.Router();
const company = require('../models/company');

router.get('/jobs', async (req, res) => {
  const data = await company.jobs(req.user);
  res.status(200).json(data);
});

router.put('/jobs/:id', async (req, res) => {
  await company.editJob(req.params.id, req.body);
  res.status(202).json({});
});

router.delete('/jobs/:id', async (req, res) => {
  await company.deleteJob(req.params.id);
  res.status(202).json({});
});

router.post('/submit', async (req, res) => {
  await company.submitJob(1, req.body);
  res.status(201).json({});
});

router.get('/app', async (req, res) => {
  let data = await company.companyApps(req.user);
  res.status(200).json(data);
});

router.put('/app/:id', async (req, res) => {
  await company.answerApp(req.params.id, req.body.status);
  res.status(202).json({});
});

router.get('/offers', async (req, res) => {
  let data = await company.companyOffers(req.user);
  res.status(200).json(data);
});

router.post('/offers/:id', async (req, res) => {
  await company.sendOffer(req.user, req.params.id, req.body);
  res.status(201).json({});
});

router.delete('/offers/:id', async (req, res) => {
  await company.deleteOffer(req.params.id);
  res.status(202).json({});
});

router.put('/edit', async (req, res) => {
  await company.editProfile(req.user, req.body);
  res.status(202).json({});
});

module.exports = router;