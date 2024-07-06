const express = require("express");
const router = express.Router();
const controller = require("../controllers/signUpController");

/* GET sign-up page. */
router.get("/", controller.get_sign_up);

/* POST sign-up page. */
router.post("/", controller.post_sign_up);

module.exports = router;
