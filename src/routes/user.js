'use strict';
//------------------------------// Third Party Resources \\----------------------------\\
const express = require('express');

//---------------------------------// Import Resources \\-------------------------------\
const user = require('../models/user');

//-------------------------------// App Level Middleware \\-----------------------------\\
const router = express.Router();

//--------------------------------------// Routess \\--------------------------------------\\
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
    res.status(201).json('Job saved');
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
    res.status(202).json('App deleted successfully');
  } catch (err) {
    next(`Can't delete app`);
  }
});

router.delete('/app-api/:id', async (req, res, next) => {
  try {
    await user.deleteAppApi(req.user, req.params.id);
    res.status(202).json('App deleted successfully');
  } catch (err) {
    next(`Can't delete app`);
  }
});

router.get('/offers', async (req, res) => {
  const data = await user.userOffers(req.user);
  res.status(200).json(data);
});

router.put('/offers/:id', async (req, res, next) => {
  try {
    await user.answerOffer(req.user, req.params.id, req.body.status);
    res.status(201).json('Offer answered successfully');
  } catch (err) {
    next(err);
  }
});

router.put('/edit', async (req, res) => {
  await user.editProfile(req.user, req.body);
  res.status(201).json('Profile updated successfully');
});
router.put('/update-experience', async (req, res) => {
  await user.updateExperience(req.user, req.body);
  res.status(201).json('Experience updated successfully');
});

router.put('/update-education', async (req, res) => {
  await user.updateEducation(req.user, req.body);
  res.status(201).json('Education updated successfully');
});

router.put('/update-courses', async (req, res) => {
  await user.updateCourses(req.user, req.body);
  res.status(201).json('Courses updated successfully');
});

router.post('/apply/:id', async (req, res) => {
  if (req.body.api) {
    await user.applyAPI(req.user, req.body);
    res.status(201).json('Job application submitted successfully');
  } else {
    await user.applyDB(req.user, { jobID: req.params.id, companyID: req.body.company_id });
    res.status(201).json('Job application submitted successfully');
  }
});

//-----------------------------------// Export The Module \\-----------------------------------\\
module.exports = router;

//-----------------------------------------------------------------------------------------\\
