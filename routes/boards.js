const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator");
const Board = require("../models/board");
const Post = require("../models/post");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const boards = await Board.find().populate("user").exec();

  res.render("board_list", {
    title: "List of Boards",
    boards,
  });
});

/* GET board page. */
router.get("/:id", async function (req, res, next) {
  const board = await Board.findById(req.params.id)
    .populate("user", "username")
    .populate("posts")
    .exec();
  for (const post of board.posts) post.populate("user", "username");

  res.render("board_detail", {
    title: board.title,
    board,
  });
});

/* POST board page. */
router.post(
  "/",
  checkSchema({
    board_title: {
      in: ["body"],
      trim: true,
      escape: true,
      isLength: {
        errorMessage: "Board title is a required field.",
        options: { min: 1 },
      },
    },
    description: {
      in: ["body"],
      trim: true,
      escape: true,
    },
  }),
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("board_list", {
        title: "List of Boards",
        board_title: req.body.board_title,
        description: req.body.description,
        errors: new Map(errors.array().map((error) => [error.path, error.msg])),
      });
    }

    const board = new Board({
      user: req.user,
      title: req.body.board_title,
      description: req.body.description,
    });
    await board.save();

    res.redirect("/boards");
  }
);

module.exports = router;
