const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

/* GET profile page. */
router.get("/", async function (req, res, next) {
  let userDocument;
  if (req.user)
    userDocument = await User.findOne(
      { username: req.user.username },
      { isMember: 1, isAdmin: 1 }
    ).exec();

  res.render("profile", {
    title: "Profile",
    userDocument,
  });
});

/* POST update username form. */
router.post(
  "/update-username",
  checkSchema({
    new_username: {
      in: ["body"],
      trim: true,
      escape: true,
      isLength: {
        errorMessage: "Username must be 3-20 characters long.",
        options: { min: 3, max: 20 },
      },
      custom: {
        options: async (value) => {
          const user = await User.findOne({ username: value }).exec();
          return user
            ? Promise.reject("Username is already in use.")
            : Promise.resolve();
        },
      },
    },
  }),
  async function (req, res, next) {
    const userDocument = await User.findOne({
      username: req.user.username,
    }).exec();

    const errors = validationResult(req);
    let errorMap;
    if (!errors.isEmpty()) {
      errorMap = new Map(
        errors.array().map((error) => [error.path, error.msg])
      );
    } else {
      userDocument.username = req.body.new_username;
      await userDocument.save();
    }

    res.render("profile", {
      title: "Profile",
      userDocument,
      errors: errorMap,
    });
  }
);

/* POST update password form. */
router.post(
  "/update-password",
  checkSchema({
    current_password: {
      in: ["body"],
      trim: true,
      escape: true,
      custom: {
        options: async (value, { req }) => {
          const user = await User.findOne(
            { username: req.user.username },
            { password: 1 }
          ).exec();
          const passwordMatch = await bcrypt.compare(value, user.password);
          return passwordMatch
            ? Promise.resolve()
            : Promise.reject("Incorrect password.");
        },
      },
    },
    new_password: {
      in: ["body"],
      trim: true,
      escape: true,
      isLength: {
        errorMessage: "Password must be 8-20 characters long.",
        options: { min: 8, max: 20 },
      },
      custom: {
        options: (value) => {
          if (!value.match(/[a-z]/))
            throw new Error("Password must include a lowercase letter.");
          if (!value.match(/[A-Z]/))
            throw new Error("Password must include an uppercase letter.");
          if (!value.match(/\d/))
            throw new Error("Password must include a number.");
          return true;
        },
      },
    },
    confirm_new_password: {
      in: ["body"],
      trim: true,
      escape: true,
      custom: {
        options: (value, { req }) => {
          if (value === req.body.new_password) return true;
          else throw new Error("Passwords do not match.");
        },
      },
    },
  })
);

/* POST update status form. */
router.post(
  "/update-status",
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

    const userDocument = await User.findOne(
      { username: req.user.username },
      { isMember: 1, isAdmin: 1 }
    ).exec();

    res.render("profile", {
      title: "Profile",
      userDocument,
      errors: errorMap,
    });
  }
);

module.exports = router;
