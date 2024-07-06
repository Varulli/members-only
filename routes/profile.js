const express = require("express");
const router = express.Router();
const controller = require("../controllers/profileController");

/* GET profile page. */
router.get("/", controller.get_profile);

/* POST update username form. */
router.post("/update-username", controller.post_update_username);

/* POST update password form. */
router.post("/update-password", controller.post_update_password);

/* POST update status form. */
router.post("/update-status", controller.post_update_status);

module.exports = router;
