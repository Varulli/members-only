const asyncHandler = require("express-async-handler");
const passport = require("passport");

// Display login form on GET.
exports.get_login = asyncHandler((req, res, next) => {
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

// Handle dev login on GET.
exports.get_dev_login = asyncHandler((req, res, next) => {
  req.body = {
    username: process.env.DEV_USERNAME,
    password: process.env.DEV_PASSWORD,
  };
  passport.authenticate("local", {
    successRedirect: "back",
    failureRedirect: "/login",
    failureMessage: true,
  })(req, res, next);
});

// Handle login on POST.
exports.post_login = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureMessage: true,
});
