'use strict';
const mongoose = require('mongoose');
const helper = require('./helper');

const post = mongoose.model('post', mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, require: true },
  comments: { type: [] },
  likes: { type: Number, default: 0 },
  pinned: { type: String, default: 'false' },
  auth_id: { type: Number, require: true },
  profile: mongoose.Schema.Types.Mixed,
  date: { type: Date, default: Date.now },
}));

// const record = {
//   title: 'test',
//   body: 'testrt tae abr ba bab arb ababab',
//   auth_id: 1,
//   profile:{test:'here'},
// };



class Community {
  constructor() {

  }

  async posts(user) {
    const pinned = await post.find({ pinned: 'true' });
    const personPost = await post.find({ auth_id: user.id, pinned: 'false' });
    const communityPosts = await post.find({ pinned: 'false', auth_id: { $ne: user.id } });
    return { pinned, personPost, communityPosts };
  }

  async getPost(postID) {
    const result = await post.find({ _id: postID });
    return result[0];
  }

  async submitPost(user, payload) {
    if (user.account_type === 'c') {
      return;
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
  }

  async deletePost(user, postID) {
    await post.findByIdAndDelete({ auth_id: user.id, _id: postID });
  }

  async updatePost(user, postID, payload) {
    const check = await post.find({ auth_id: user.id, _id: postID });
    if (check.length > 0) {
      await post.findByIdAndUpdate(postID, payload, { new: true });
    }
  }

  async addComment(user, postID, payload) {

    const idPerson = await helper.getID(user.id, 'person');
    const profile = await helper.getProfile(idPerson, 'person');
    const newComment = {
      writerID: user.id,
      comment: payload.comment,
      profile: `${profile.first_name} ${profile.last_name}`, avatar: profile.avatar, job_title: profile.job_title,
      date: (new Date()).toString(),
    };
    const targetPost = await this.getPost(postID);
    targetPost.comments.push(newComment);
    await targetPost.save();

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
    }
  }

  async searchPosts(title) {
    const result = await post.find(
      { 'title': { '$regex': `${title}`, '$options': 'i' } },
      function (err, docs) {
      },
    );
    return result;
  }
}

module.exports = new Community();

// tests--------
// function test() {
// const newR = new post(record);
// newR.save();
// 5fa702a089dcd943290dc5cf
// async function test() {
//   const x = await post.find({ _id: '5fa702a089dcd943290dc5cf' });
//   console.log(x);
//   x[0].comments.push({by:'auth_id',comment:'g',like:0});
//   x[0].save();
// }
// test();
// newR.findByIdAndUpdate('5fa7018ee7312742eb3f1bc0', record, { new: true });
// }

