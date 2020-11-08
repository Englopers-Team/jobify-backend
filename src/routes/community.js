'use strict';
const express = require('express');
const router = express.Router();
const community = require('../models/community');

router.get('/', async (req, res) => {
  const result = await community.posts(req.user);
  res.status(200).json(result);
});

router.get('/search', async (req, res) => {
  const result = await community.searchPosts(req.query.title);
  res.status(200).json(result);
});

router.post('/submit', async (req, res) => {
  await community.submitPost(req.user, req.body);
  res.status(201).json('submited job');
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
    await community.addComment(req.user, req.params.id, req.body);
    res.status(201).json('Commented');
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
    res.status(201).json('Deleted comment');

  } catch (err) {
    next(`can't like post`);
  }
});

module.exports = router;