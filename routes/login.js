const express = require("express");
const router = express.Router();
const passport = require("passport");

/* GET login page. */
router.get("/", (req, res, next) => {
  if (res.locals.currentUser) res.redirect("/");
  else res.render("login", { title: "Login" });
});

/* POST login page. */
router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = router;
