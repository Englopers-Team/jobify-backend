'use strict';
const mongoose = require('mongoose');
const helper = require('./helper');

const post = mongoose.model(
  'post',
  mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, require: true },
    comments: { type: [] },
    likes: { type: [] },
    pinned: { type: String, default: 'false' },
    auth_id: { type: Number, require: true },
    profile: mongoose.Schema.Types.Mixed,
    date: { type: Date, default: Date.now },
  }),
);

class Community {
  constructor() {}

  async posts(user) {
    const pinned = await post.find({ pinned: 'true' });
    const personPost = await post.find({ auth_id: user.id, pinned: 'false' });
    const communityPosts = await post.find({ pinned: 'false', auth_id: { $ne: user.id } });
    return { pinned, personPost, communityPosts };
  }

  async getPost(postID) {
    const result = await post.find({ _id: postID });
    console.log(result[0]);
    return result[0];
  }

  async submitPost(user, payload) {
    if (user.account_type === 'c') {
      throw new Error(`You need to be employee`);
    }
    const id = await helper.getID(user.id, 'person');
    const profile = await helper.getProfile(id, 'person');

    const record = {
      title: payload.title,
      body: payload.body,
      auth_id: user.id,
      profile: { name: `${profile.first_name} ${profile.last_name}`, avatar: profile.avatar, job_title: profile.job_title },
    };

    const newPost = new post(record);
    await newPost.save();
    return newPost;
  }

  async deletePost(user, postID) {
    if (user.account_type == 'p') {
      await post.findByIdAndDelete({ auth_id: user.id, _id: postID });
    } else {
      await post.findByIdAndDelete({ _id: postID });
    }
  }

  async updatePost(user, postID, payload) {
    const check = await post.find({ auth_id: user.id, _id: postID });
    if (check.length > 0) {
      await post.findByIdAndUpdate(postID, payload, { new: true });
    }
  }
  // real event
  async addComment(user, postID, payload) {
    const idPerson = await helper.getID(user.id, 'person');
    const profile = await helper.getProfile(idPerson, 'person');
    const newComment = {
      writerID: user.id,
      comment: payload.comment,
      profile: `${profile.first_name} ${profile.last_name}`,
      avatar: profile.avatar,
      job_title: profile.job_title,
      date: new Date().toString(),
    };
    const targetPost = await this.getPost(postID);
    targetPost.comments.push(newComment);
    await targetPost.save();
    return targetPost.comments.length;
  }

  async deleteComment(user, postID, commentID) {
    const targetPost = await this.getPost(postID);
    if (!targetPost.comments[commentID]) {
      throw new Error('Comment not found');
    }
    const comments = targetPost.comments;
    const check = comments[commentID].writerID == user.id;
    const newComments = [];
    if (check) {
      comments.forEach((item, index) => {
        if (index != commentID) {
          newComments.push(item);
        }
      });
      targetPost.comments = newComments;
      targetPost.save();
    } else {
      throw new Error(`Comment is not yours`);
    }
  }

  async searchPosts(title) {
    const result = await post.find({ title: { $regex: `${title}`, $options: 'i' } }, function (err, docs) {});
    return result;
  }
  // real event

  async likePost(user, postID) {
    const targetPost = await this.getPost(postID);
    const likes = targetPost.likes;
    let status = 'like';
    likes.forEach((like, index) => {
      if (like == user.id) {
        delete likes[index];
        status = 'dislike';
      }
    });
    if (status == 'like') {
      likes.push(user.id);
    }
    targetPost.likes = likes;
    await targetPost.save();
  }
  async pin(postID) {
    const targetPost = await this.getPost(postID);
    console.log(postID);
    console.log(targetPost);
    targetPost.pinned = 'true';
    await targetPost.save();
  }
}

module.exports = new Community();
