const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const userModel = require("../schemas/users");
const jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");

exports.creteSignInForm = [
  passport.authenticate("local"),
  asyncHandler(async (req, res, next) => {
    console.log(req);
    // Get the user from db for his user id
    const currUser = await userModel
      .findOne({ username: req.body.username })
      .exec();
    if (currUser === null) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        status: "Username does not exist",
      });
    } else {
      const token = jwt.sign({ _id: currUser.id }, "test", { expiresIn: 3600 });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
      });
    }
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
  body("password", "Choose a strong Password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isStrongPassword(),
  asyncHandler(async (req, res, next) => {
    const dbUser = await userModel
      .findOne({ username: req.body.username })
      .exec();
    console.log("User in the DB", dbUser);
    const vr = validationResult(req);
    if (dbUser != null) {
      res.render("userSignUpForm", {
        user: req.body,
        errorMessage: "The username is already in use",
      });
    } else if (!vr.isEmpty()) {
      let errorMessages = "";
      vr.errors.forEach((error) => {
        errorMessages = errorMessages + error.msg + "  ";
      });
      res.status(400).json({
        errors: errorMessages,
      });
    } else {
      console.log("This is the request body", req.body);
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          res.status(400).json({
            errors: "There is a error with the server Try again!!!",
          });
        } else {
          const newUser = new userModel({
            username: req.body.username,
            password: hashedPassword,
            status: false,
            fullname: req.body.fullname,
            isAdmin: false,
          });
          await newUser.save();
          res.status(200).json({
            status: "true",
            message: "User registered successfully",
          });
        }
      });
    }
  }),
];

// Need to verify if that is correct then update the user
exports.createMakeMember = [
  body("passcode", "enter a correct passcode").trim().matches("sun"),
  body("username", "Username should not be empty").notEmpty(),
  asyncHandler(async (req, res, next) => {
    const vr = validationResult(req);
    if (!vr.isEmpty()) {
      let errorMessages = "";
      vr.errors.forEach((error) => {
        errorMessages = errorMessages + error.msg + "  ";
      });
      console.log("error messages in request", errorMessages);
      res.status(401).json({
        status: "false",
        message: "Enter a correct Passcode",
      });
    } else {
      const prevVal = await userModel
        .findOne({ username: req.body.username })
        .exec();
      const newUser = new userModel({
        username: prevVal.username,
        password: prevVal.password,
        status: true,
        fullname: prevVal.fullname,
        isAdmin: prevVal.isAdmin,
        _id: prevVal.id,
      });
      try {
        const newuser = await userModel
          .findByIdAndUpdate(prevVal.id, newUser, {
            new: true,
          })
          .exec();
        if (!newuser) throw newuser;
      } catch (err) {
        res.status(400).json({
          status: "false",
          message: "user not found please log out and login again",
        });
      }
      res.status(200).json({
        status: "true",
        message: "The user was made a member",
      });
    }
  }),
];

exports.createMakeAdmin = [
  body("passcode").equals("manikanth"),
  asyncHandler(async (req, res, next) => {
    let vr = validationResult(req);
    if (!vr.isEmpty()) {
      console.log(`vr is ${vr}`);
      res.status(401).json({
        errorMessage:
          "firstname of the application creator small caps(Check github)",
      });
    } else {
      const prevVal = await userModel
        .findOne({ username: req.body.username })
        .exec();
      const newUser = new userModel({
        username: prevVal.username,
        password: prevVal.password,
        status: prevVal.status,
        fullname: prevVal.fullname,
        isAdmin: true,
        _id: prevVal.id,
      });
      try {
        const newuser = await userModel
          .findByIdAndUpdate(prevVal.id, newUser, {
            new: true,
          })
          .exec();
        if (!newuser) throw "Error!";
        else {
          res.status(200).json({
            message: "User Updated!",
          });
        }
      } catch (err) {
        res.status(401).json({
          message: "User not found. Please sign out and sign in",
        });
      }
    }
  }),
];

exports.testauth = [
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      username: req.user.username,
      fullname: req.user.fullname,
      isAdmin: req.user.isAdmin,
      status: req.user.status,
    });
  }),
];
