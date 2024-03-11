const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  username: { type: String, required: true, maxLength: 25 },
  password: { type: String, required: true },
  status: { type: Boolean, required: true, default: false },
  fullname: { type: String, required: true, maxLength: 100 },
  isAdmin: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("User", userSchema);
