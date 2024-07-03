const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user");

/* GET sign-up page. */
router.get("/", function (req, res, next) {
  res.render("sign-up", { title: "Sign Up" });
});

/* POST sign-up page. */
router.post(
  "/",
  async function (req, res, next) {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) return next(err);
      try {
        // Create a new user
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });

        // Save the user
        await user.save();
        next();
      } catch (err) {
        return next(err);
      }
    });
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

module.exports = router;
