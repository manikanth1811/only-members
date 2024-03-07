const asyncHandler = require("express-async-handler");
const messageModel = require("../schemas/messages");
const userModel = require("../schemas/users");
const passport = require("passport");

const { body, validationResult } = require("express-validator");

exports.getAllMessages = asyncHandler(async (req, res, next) => {
  const messages = await messageModel.find({}).populate("messageUser").exec();
  let currUser = null;
  console.log(req.session);
  if (req.session.passport) {
    currUser = await userModel.findById(req.session.passport.user).exec();
  }
  console.log(currUser);
  res.render("index", { messages: messages, User: currUser });
});

exports.getMessageForm = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render("create-message-form");
  } else {
    res.redirect("/");
  }
});

// TODO: Check how to get the user _id from session to store the message.
exports.createMessage = [
  body("messageBody", "The message body is empty try again")
    .trim()
    .notEmpty()
    .escape(),
  body("messageUser").optional(),
  asyncHandler(async (req, res, next) => {
    const vr = validationResult(req);
    console.log(vr);
    if (!vr.isEmpty()) {
      res.render("create-message-form", {
        errorMessage: "testing error",
        messageData: req.body,
      });
    }
    if (!req.isAuthenticated()) {
      res.render("create-message-form", {
        errorMessage: "Please log-in to create a message",
        messageData: req.body,
      });
    } else {
      // get the user from the username and attach the id in the create message

      // get the userId from the mongoose-session?
      const newMessage = new messageModel({
        messageBody: req.body.messageBody,
        messageHead: req.body.messageHead,
        messageUser: req.session.passport.user,
        messageTime: new Date(),
      });
      await newMessage.save();
      res.redirect("/");
    }
  }),
];

// TODO: Delete the message
// Seach message by date, message title and body then delete
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  // get the message id then remove it from the db
  await messageModel.findByIdAndDelete(req.params.id).exec();

  res.redirect("/");
});
