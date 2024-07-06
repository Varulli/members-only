const express = require("express");
const router = express.Router();
const controller = require("../controllers/loginController");

/* GET login page. */
router.get("/", controller.get_login);

/* GET dev login */
router.get("/dev", controller.get_dev_login);

/* POST login page. */
router.post("/", controller.post_login);

module.exports = router;
