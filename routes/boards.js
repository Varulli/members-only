const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator");
const Board = require("../models/board");
const Post = require("../models/post");

/* GET board list page. */
router.get("/", async function (req, res, next) {
  const boards = await Board.find().populate("user").exec();

  res.render("board_list", {
    title: "List of Boards",
    boards,
  });
});

/* GET board detail page. */
router.get("/:id", async function (req, res, next) {
  const board = await Board.findById(req.params.id)
    .populate("user", "username")
    .populate({
      path: "posts",
      populate: {
        path: "user",
        select: "username",
      },
    })
    .exec();
  console.log(board.posts);
  res.render("board_detail", {
    title: board.title,
    board,
  });
});

/* POST board list page. */
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

/* POST board detail page. */
router.post(
  "/:id",
  checkSchema({
    content: {
      in: ["body"],
      trim: true,
      escape: true,
    },
  }),
  async function (req, res, next) {
    if (req.body.content) {
      const post = new Post({
        user: req.user,
        content: req.body.content,
      });

      const board = await Board.findById(req.params.id).exec();
      board.posts.push(post);
      console.log(post);
      await Promise.all([post.save(), board.save()]);
    }

    res.redirect(`/boards/${req.params.id}`);
  }
);

module.exports = router;
