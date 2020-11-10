'use strict';
const express = require('express');
const helper = require('../models/helper');
const router = express.Router();
const fs = require('fs');

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
          console.error(err);
          return;
        }
      });
      return res.send('File size should not exceed 3.0MB');
    } else {
      await helper.updateFiles(req.user, req.file);
      return res.status(201).json({
        message: 'File uploaded successfully',
      });
    }
  } catch (error) {
    console.error(error);
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
          console.error(err);
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
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
