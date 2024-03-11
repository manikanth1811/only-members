const asyncHandler = require("express-async-handler");
const messageModel = require("../schemas/messages");
const userModel = require("../schemas/users");
const passport = require("passport");

const { body, validationResult } = require("express-validator");

exports.getAllMessages = asyncHandler(async (req, res, next) => {
  const messages = await messageModel
    .find({})
    .sort({ messageTime: -1 })
    .populate("messageUser")
    .exec();
  if (req.query.page != undefined) {
    if (messages.length > req.query.page * 10) {
      messages = messages.slice((req.query.page - 1) * 10, req.query.page * 10);
    }
  }
  const currUserName = req.body.username ? req.body.username : "";
  let messagesNoInfo = [];
  messages.forEach((message) => {
    messagesNoInfo.push({
      messageBody: message.messageBody,
      messageHead: message.messageHead,
    });
  });
  const currUser = await userModel
    .findOne({ username: req.body.username })
    .exec();
  if (!currUser) {
    res.status(200).json({
      messages: messagesNoInfo,
    });
  } else if (currUser.isAdmin || currUser.status) {
    res.status(200).json({
      messages: messages,
    });
  } else {
    res.status(200).json({
      messages: messagesNoInfo,
    });
  }
});

// TODO: Check how to get the user _id from session to store the message.
exports.createMessage = [
  body("messageBody", "The message body is empty try again")
    .trim()
    .notEmpty()
    .escape(),
  body("messageHead", "The message Head is empty try again")
    .trim()
    .notEmpty()
    .escape(),
  asyncHandler(async (req, res, next) => {
    const vr = validationResult(req);
    if (!vr.isEmpty()) {
      res.status(401).json({
        message: "The message head or message body is empty try again",
      });
    } else {
      if (req.body.username === undefined) {
        res.status(401).json({
          message: "Send the userdata to post a message",
        });
      } else {
        let currUser = await userModel
          .findOne({ username: req.body.username })
          .exec();
        if (!currUser) {
          res.status(401).json({
            message: "User doesn't exist",
          });
        } else if (currUser.status != true) {
          res.status(401).json({
            message: "User is not a member",
          });
        } else {
          const newMessage = new messageModel({
            messageBody: req.body.messageBody,
            messageHead: req.body.messageHead,
            messageUser: currUser.id,
            messageTime: new Date(),
          });
          await newMessage.save();
          res.status(200).json({
            message: "message created",
          });
        }
      }
    }
  }),
];

// TODO: Delete the message
// Seach message by date, message title and body then delete
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  if (req.body.username === undefined) {
    res.status(400).json({
      message: "Give Username to perform the action",
    });
  } else {
    let currUser = await userModel
      .findOne({ username: req.body.username })
      .exec();
    if (!currUser) {
      res.status(401).json({
        message: "The current user doesn't exist",
      });
    } else if (currUser.isAdmin) {
      try {
        const removedDoc = await messageModel
          .findByIdAndDelete(req.body.id)
          .exec();
        if (!removedDoc) {
          res.status(401).json({
            message: "The message you want to delete doesn't exist",
          });
        } else {
          res.status(200).json({
            message: "The message was deleted",
          });
        }
      } catch (err) {
        res.status(500).json({
          message: "The message doesn't exist on DB try again",
        });
      }
    } else {
      res.status(401).json({
        message: "User is not authorized to perfrom the action",
      });
    }
  }
});
