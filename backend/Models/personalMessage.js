const mongoose = require("mongoose");

// creating schema for personal message
//sender
//body//

const MessageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    body: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatModel",
    },
  },
  {
    timestamps: true,
  }
);

//creating model..
const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
