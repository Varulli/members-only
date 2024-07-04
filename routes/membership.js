const express = require("express");
const router = express.Router();
const User = require("../models/user");

/* GET membership page. */
router.get("/", function (req, res, next) {
  res.render("membership", { title: "Membership" });
});
