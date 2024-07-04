var express = require("express");
var router = express.Router();
const Board = require("../models/board");
const User = require("../models/user");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const boards = await Board.find().populate("user").exec();

  res.render("index", {
    title: "Homepage",
    boards,
  });
});

module.exports = router;
