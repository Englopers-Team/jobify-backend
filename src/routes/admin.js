'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const express = require('express');

//---------------------------------// Import Resources \\-------------------------------\\
const admin = require('../models/admin');
const helper = require('../models/helper');
const authorize = require('../middleware/auth/authorization/authorize');
const community = require('../models/community');
const client = require('../models/database');

//-------------------------------// App Level Middleware \\-----------------------------\\
const router = express.Router();

//--------------------------------------// Routes \\--------------------------------------\\
router.get('/', async (req, res) => {
  const data = await admin.dashboard();
  res.status(200).json(data);
});

router.patch('/block/:id', authorize(['admin']), async (req, res, next) => {
  try {
    let id = req.params.id;
    await admin.block(id);
    res.status(201).json({ status: 'block done' });
  } catch (error) {
    next(error);
  }
});

router.patch('/removeBlock/:id', authorize(['admin']), async (req, res) => {
  let id = req.params.id;
  await admin.removeBlock(id);
  res.status(201).json({ status: 'block removed' });
});

router.get('/report', async (req, res) => {
  const data = await admin.reports();
  const SQL2 = `SELECT account_type FROM auth WHERE WHERE id=$1;`;
  const values2 = [data.auth_id];
  const result2 = await client.query(SQL2, values2);
  const account_type = result2.rows[0].account_type;
  let table;
  if (account_type === 'c') {
    table = 'company';
  } else if (account_type === 'p') {
    table = 'person';
  }
  const SQL = `SELECT * FROM ${table} WHERE auth_id=$1`;
  const values = [data.auth_id];
  const result = await client.query(SQL, values);
  const data2 = result.rows[0];
  res.status(200).json({ reportDetaild: data, senderDetails: data2 });
});

router.get('/report/:id', async (req, res) => {
  const data = await admin.report(req.params.id);
  res.status(200).json(data);
});

router.patch('/report/:id', async (req, res) => {
  await admin.answerReport(req.params.id, req.body.response);
  res.status(201).json('Report answered successfully');
});

router.delete('/report/:id', authorize(['admin']), async (req, res) => {
  await admin.deleteReport(req.params.id);
  res.status(202).json('Report deleted successfully');
});

router.post('/seed/:id', authorize(['admin']), async (req, res) => {
  const arr = await helper.generateJobs(req.params.id);
  await helper.seedDB(arr);
  res.status(200).json('seeded db');
});

router.get('/posts', async (req, res) => {
  const data = await community.posts(req.user);
  res.status(200).json(data);
});

router.get('/posts/:id', async (req, res) => {
  const data = await community.getPost(req.params.id);
  res.status(200).json(data);
});

router.patch('/posts/:id', async (req, res) => {
  await community.pin(req.params.id);
  res.status(201).json('Post updated successfully');
});

router.delete('/posts/:id', async (req, res) => {
  await community.deletePost(req.user.id, req.params.id);
  res.status(201).json('Post Deleted successfully');
});

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = router;

//-----------------------------------------------------------------------------------------\\
