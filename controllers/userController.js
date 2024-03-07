const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const userModel = require("../schemas/users");

const { body, validationResult } = require("express-validator");

exports.getSignInForm = asyncHandler((req, res, next) => {
  res.render("userSignInForm");
});

exports.getSignUpForm = asyncHandler((req, res, next) => {
  res.render("userSignUpForm");
});

exports.getMakeMember = asyncHandler((req, res, next) => {
  res.render("userMakeMemberForm");
});

exports.creteSignInForm = [
  body("username", "username should be present").trim().notEmpty().escape(),
  body("password", "password should not be empty").trim().notEmpty().escape(),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
  }),
];

// Check if all the data is correct if correct check if the username already exists based on that send the same error
exports.createSignUpForm = [
  body("username", "username should be non empty and alphanumeric")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlphanumeric(),
  body("fullname", "fullname should only contains a-z or A-Z")
    .trim()
    .isLength({ min: 1 })
    .matches(/^[a-zA-Z\s]+$/),
  body("password", "password should have atleast")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isStrongPassword(),
  asyncHandler(async (req, res, next) => {
    // need to check if the username is already present
    const dbUser = await userModel
      .findOne({ username: req.body.username })
      .exec();
    console.log(dbUser);
    const vr = validationResult(req);
    if (dbUser != null) {
      res.render("userSignUpForm", {
        user: req.body,
        errorMessage: "The username is already in use",
      });
    } else if (!vr.isEmpty()) {
      console.log(vr);
      res.render("userSignUpForm", {
        user: req.body,
        errorMessage: "Error creating a user Please try again",
      });
    } else {
      console.log("This is the request body", req.body);
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          console.log("error during the crypto");
        } else {
          const newUser = new userModel({
            username: req.body.username,
            password: hashedPassword,
            status: false,
            fullname: req.body.fullname,
            isAdmin: false,
          });
          newUser.save();
          res.redirect("/");
        }
      });
    }
  }),
];

exports.getMakeAdminForm = asyncHandler((req, res, next) => {
  res.render("makeAdminForm");
});

// Need to verify if that is correct then update the user
exports.createMakeMember = [
  body("passcode", "enter a correct passcode").trim().matches("sun"),
  asyncHandler(async (req, res, next) => {
    const vr = validationResult(req);
    if (!vr.isEmpty()) {
      console.log(vr);
      res.render("userMakeMemberForm", {
        errorMessage: "Enter correct passcode, Look at the hint",
      });
    } else {
      console.log(req.session);
      const prevVal = await userModel
        .findById(req.session.passport.user)
        .exec();
      const newUser = new userModel({
        username: prevVal.username,
        password: prevVal.password,
        status: true,
        fullname: prevVal.fullname,
        isAdmin: prevVal.isAdmin,
        _id: req.session.passport.user,
      });
      const newuser = await userModel
        .findByIdAndUpdate(req.session.passport.user, newUser, {
          new: true,
        })
        .exec();
      console.log("new User", newuser);
      res.redirect("/");
    }
  }),
];

exports.createMakeAdmin = [
  body("passcodeAdmin").equals("manikanth"),
  asyncHandler(async (req, res, next) => {
    let vr = validationResult(req);
    if (!vr.isEmpty()) {
      res.render("makeAdminForm", {
        errorMessage: "firstname of the admin small caps",
      });
    } else {
      const prevVal = await userModel
        .findById(req.session.passport.user)
        .exec();
      const newUser = new userModel({
        username: prevVal.username,
        password: prevVal.password,
        status: prevVal.status,
        fullname: prevVal.fullname,
        isAdmin: true,
        _id: req.session.passport.user,
      });
      const newuser = await userModel
        .findByIdAndUpdate(req.session.passport.user, newUser, {
          new: true,
        })
        .exec();
      res.redirect("/");
    }
  }),
];

exports.logOut = asyncHandler((req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
