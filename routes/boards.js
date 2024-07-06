const express = require("express");
const router = express.Router();
const controller = require("../controllers/boardsController");

/* GET board list page. */
router.get("/", controller.get_board_list);

/* GET board detail page. */
router.get("/:id", controller.get_board_detail);

/* POST board list page. */
router.post("/", controller.post_board_list);

/* POST board detail page. */
router.post("/:id", controller.post_board_detail);

module.exports = router;
