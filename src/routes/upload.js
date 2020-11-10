'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const express = require('express');
const fs = require('fs');

//---------------------------------// Import Resources \\-------------------------------\\
const helper = require('../models/helper');

//-------------------------------// App Level Middleware \\-----------------------------\\
const router = express.Router();

//--------------------------------------// Routes \\--------------------------------------\\
router.post('/profile_pic', helper.uploader().single('profile_pic'), async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send('Please select an image to upload');
    } else if (req.file.size > 3000000) {
      const path = `./uploads/profile-pictures/${req.file.filename}`;
      fs.unlink(path, (err) => {
        if (err) {
          throw new Error(err);
        }
      });
      return res.send('File size should not exceed 3.0MB');
    } else {
      await helper.updateFiles(req.user, req.file);
      return res.status(201).json({
        message: 'File uploaded successfully',
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});

router.post('/cv', helper.uploader().single('cv'), async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send('Please select a pdf or doc file to upload');
    } else if (req.file.size > 6000000) {
      const path = `./uploads/cv/${req.file.filename}`;

      fs.unlink(path, (err) => {
        if (err) {
          return;
        }
      });
      return res.send('File size should not exceed 5.0MB');
    } else {
      await helper.updateFiles(req.user, req.file);
      return res.status(201).json({
        message: 'File uploaded successfully',
        data: helper.pdfScanner(req.file.filename),
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = router;

//-----------------------------------------------------------------------------------------\\