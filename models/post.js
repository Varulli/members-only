const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const luxon = require("luxon");

const Post = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

Post.virtual("createdAtFormatted").get(function () {
  return luxon.DateTime.fromJSDate(this.createdAt).toLocaleString(
    luxon.DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model("Post", Post);
