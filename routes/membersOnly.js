const express = require("express");

const route = express.Router();

const userInstance = require("../controllers/userController");
const messageInstance = require("../controllers/messageController");

route.get("/", messageInstance.getAllMessages);

route.get("/create-message", messageInstance.getMessageForm);

route.post("/create-message", messageInstance.createMessage);

route.post("/delete-message/:id", messageInstance.deleteMessage);

route.get("/sign-in", userInstance.getSignInForm);

route.get("/sign-up", userInstance.getSignUpForm);

route.get("/make-member", userInstance.getMakeMember);

route.post("/sign-in", userInstance.creteSignInForm);

route.post("/sign-up", userInstance.createSignUpForm);

route.post("/make-member", userInstance.createMakeMember);

route.get("/make-admin", userInstance.getMakeAdminForm);

route.post("/make-admin", userInstance.createMakeAdmin);

route.get("/logOut", userInstance.logOut);

module.exports = route;
