const express = require("express");
const router = express.Router();
const passport = require("passport");

/* GET login page. */
router.get("/", function (req, res, next) {
  if (req.user) return res.redirect("/");

  let error;
  if (req.session.messages) {
    error = req.session.messages[req.session.messages.length - 1];
    req.session.messages.length = 0;
  }

  res.render("login", {
    title: "Login",
    username: req.body.username,
    password: req.body.password,
    error,
  });
});

/* POST login page. */
router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

module.exports = router;
