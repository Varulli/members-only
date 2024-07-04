const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

/* GET profile page. */
router.get("/", async function (req, res, next) {
  res.render("profile", { title: "Profile" });
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
    const errors = validationResult(req);
    let errorMap;
    if (!errors.isEmpty()) {
      errorMap = new Map(
        errors.array().map((error) => [error.path, error.msg])
      );
    } else {
      req.user.username = req.body.new_username;
      await req.user.save();
    }

    res.render("profile", {
      title: "Profile",
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
          const passwordMatch = await bcrypt.compare(value, req.user.password);
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
    confirm_password: {
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
  }),
  async function (req, res, next) {
    const errors = validationResult(req);
    console.log(errors.array());
    let errorMap;
    if (!errors.isEmpty()) {
      errorMap = new Map(
        errors.array().map((error) => [error.path, error.msg])
      );
    } else {
      req.user.password = await bcrypt.hash(req.body.new_password, 10);
      await req.user.save();
    }
    console.log(errorMap);
    res.render("profile", {
      title: "Profile",
      errors: errorMap,
    });
  }
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
            req.user.isMember = true;
            await req.user.save();
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
            req.user.isAdmin = true;
            await req.user.save();
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

    res.render("profile", {
      title: "Profile",
      errors: errorMap,
    });
  }
);

module.exports = router;
