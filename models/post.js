const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true, minLength: 3, maxLength: 100 },
  body: { type: String, required: true, minLength: 100, maxLength: 10000 },
  date: { type: Date, required: true },
  topic: { type: Schema.Types.ObjectId, required: true, ref: 'Topic' },
  comments: [{ type: Schema.Types.ObjectId, required: true, ref: 'Comment' }],
});

PostSchema.virtual('url').get(function () {
  return `/posts/${this._id}`;
});

module.exports = mongoose.model('Post', PostSchema);
