const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator");
const User = require("../models/user");

/* GET membership page. */
router.get("/", async function (req, res, next) {
  let userDocument;
  if (req.user)
    userDocument = await User.findOne(
      { username: req.user.username },
      { isMember: 1, isAdmin: 1 }
    ).exec();

  res.render("membership", {
    title: "Update Membership Status",
    userDocument,
  });
});

/* POST membership page. */
router.post(
  "/",
  checkSchema({
    member_passcode: {
      in: ["body"],
      optional: { options: { values: "falsy" } },
      trim: true,
      escape: true,
      custom: {
        options: async (value, { req }) => {
          if (value === process.env.MEMBER_PASSCODE) {
            const user = await User.findOne({
              username: req.user.username,
            }).exec();
            user.isMember = true;
            await user.save();
            return Promise.resolve();
          } else return Promise.reject("Incorrect passcode.");
        },
      },
    },
    admin_passcode: {
      in: ["body"],
      optional: { options: { values: "falsy" } },
      trim: true,
      escape: true,
      custom: {
        options: async (value, { req }) => {
          if (value === process.env.ADMIN_PASSCODE) {
            const user = await User.findOne({
              username: req.user.username,
            }).exec();
            user.isAdmin = true;
            await user.save();
            return Promise.resolve();
          } else return Promise.reject("Incorrect passcode.");
        },
      },
    },
  }),
  async function (req, res, next) {
    const errors = validationResult(req);
    let errorMap;
    if (!errors.isEmpty()) {
      errorMap = new Map(
        errors.array().map((error) => [error.path, error.msg])
      );
    }

    let userDocument;
    if (req.user)
      userDocument = await User.findOne(
        { username: req.user.username },
        { isMember: 1, isAdmin: 1 }
      ).exec();

    res.render("membership", {
      title: "Update Membership Status",
      userDocument,
      errors: errorMap,
    });
  }
);

module.exports = router;
