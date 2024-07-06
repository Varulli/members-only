const express = require("express");
const router = express.Router();

/* GET logout. */
router.get("/", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  res.redirect("back");
});

module.exports = router;
