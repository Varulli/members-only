const express = require("express");
const router = express.Router();
const controller = require("../controllers/boardsController");

/* GET board list page. */
router.get("/", controller.get_board_list);

/* GET board detail page. */
router.get("/:id", controller.get_board_detail);

/* POST board list page (create board). */
router.post("/", controller.post_board_list_create);

/* POST board list page (delete board). */
router.post("/delete/:id", controller.post_board_list_delete);

/* POST board detail page (create post). */
router.post("/:id", controller.post_board_detail);

/* POST board detail page (delete post). */
router.post("/:id/delete/:post_id", controller.post_board_detail_delete);

module.exports = router;
