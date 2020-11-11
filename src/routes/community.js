'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const express = require('express');

//---------------------------------// Import Resources \\-------------------------------\\
const community = require('../models/community');

//-------------------------------// App Level Middleware \\-----------------------------\\
const router = express.Router();

//--------------------------------------// Routes \\--------------------------------------\\
router.get('/', async (req, res) => {
  const result = await community.posts(req.user);
  res.status(200).json(result);
});

router.get('/search', async (req, res) => {
  const result = await community.searchPosts(req.query.title);
  res.status(200).json(result);
});

router.post('/submit', async (req, res,next) => {
  try {
    const result = await community.submitPost(req.user, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/post/:id', async (req, res, next) => {
  try {
    const result = await community.getPost(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(`Can't find post`);
  }
});

router.delete('/post/:id', async (req, res, next) => {
  try {
    await community.deletePost(req.user, req.params.id);
    res.status(202).json('Deleted post');
  } catch (err) {
    next(`Can't delete post`);
  }
});

router.patch('/post/:id', async (req, res, next) => {
  try {
    await community.updatePost(req.user, req.params.id, req.body);
    res.status(201).json('Updated post');
  } catch (err) {
    next(`Can't update post`);
  }
});

router.post('/comment/:id', async (req, res, next) => {
  try {
    const result = await community.addComment(req.user, req.params.id, req.body);
    res.status(201).json({commentID:result-1});
  } catch (err) {
    next(`Can't submit comment`);
  }
});

router.delete('/comment/:id', async (req, res, next) => {
  try {
    await community.deleteComment(req.user, req.params.id, req.body.commentID);
    res.status(202).json('Deleted comment');
  } catch (err) {
    next(err);
  }
});

router.patch('/like/:id', async (req, res, next) => {
  try {
    await community.likePost(req.user, req.params.id);
    res.status(201).json('Liked post');
  } catch (err) {
    next(`can't like post`);
  }
});

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = router;

//-----------------------------------------------------------------------------------------\\
