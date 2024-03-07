const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  messageBody: { type: String, required: true, maxLength: 500 },
  messageHead: { type: String, required: true, maxLength: 100 },
  messageUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messageTime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);
