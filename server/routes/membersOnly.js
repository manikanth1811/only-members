const express = require("express");

const route = express.Router();

const userInstance = require("../controllers/userController");
const messageInstance = require("../controllers/messageController");

route.post("/", messageInstance.getAllMessages);

route.post("/message", messageInstance.createMessage);

route.post("/deletemessage", messageInstance.deleteMessage);

route.post("/sign-in", userInstance.creteSignInForm);

route.post("/sign-up", userInstance.createSignUpForm);

route.post("/member", userInstance.createMakeMember);

route.post("/admin", userInstance.createMakeAdmin);

route.post("/testauth", userInstance.testauth);

module.exports = route;
