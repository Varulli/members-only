const asyncHandler = require("express-async-handler");
const { checkSchema, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user");

// Display sign-up page on GET.
exports.get_sign_up = asyncHandler((req, res, next) => {
  res.render("sign-up", { title: "Sign Up" });
});

// Handle sign-up form on POST.
exports.post_sign_up = [
  checkSchema({
    username: {
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
    password: {
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
          if (value === req.body.password) return true;
          else throw new Error("Passwords do not match.");
        },
      },
    },
  }),
  asyncHandler(async (req, res, next) => {
    // Re-render the sign-up page with error messages if there are any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("sign-up", {
        title: "Sign Up",
        username: req.body.username,
        password: req.body.password,
        errors: new Map(errors.array().map((error) => [error.path, error.msg])),
      });
    }

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
  }),
  // Log in with the new user
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
];
