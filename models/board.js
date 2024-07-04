const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const luxon = require("luxon");

const Board = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  createdAt: { type: Date, default: Date.now() },
});

Board.virtual("createdAtFormatted").get(function () {
  return luxon.DateTime.fromJSDate(this.createdAt).toLocaleString(
    luxon.DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model("Board", Board);
