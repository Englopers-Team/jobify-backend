'use strict';
const express = require('express');
const router = express.Router();
const helper = require('../models/helper');
const ip = require('../middleware/location');

// mongodb

router.get('/', (req, res) => {});

router.post('/block', (req, res) => {});

router.get('/posts', (req, res) => {});

router.delete('/posts/:id', (req, res) => {});

router.delete('/comments/:id', (req, res) => {});

router.post('/approve/:id', (req, res) => {});

router.get('/report', (req, res) => {});

router.get('/report/:id', (req, res) => {});

module.exports = router;
