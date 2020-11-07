'use strict';
const mongoose = require('mongoose');


const post = mongoose.model('post', mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, require: true },
  comments: { type: [] },
  likes: { type: Number, default: 0 },
  pinned: { type: String, default: 'false' },
  auth_id: { type: Number, require: true },
  profile: mongoose.Schema.Types.Mixed,
}));

const record = {
  title: 'test',
  body: 'testrt tae abr ba bab arb ababab',
  auth_id: 1,
  profile:{test:'here'},
};



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
