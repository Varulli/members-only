const express = require("express");
const router = express.Router();
const Board = require("../models/board");

/* GET board page. */
router.get("/:id", async function (req, res, next) {
  const board = await Board.findById(req.params.id).populate("user").exec();

  res.render("board", {
    title: board.title,
    board,
  });
});

module.exports = router;
