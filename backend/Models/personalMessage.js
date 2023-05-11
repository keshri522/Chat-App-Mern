const mongoose = require("mongoose");

// creating schema for personal message
//sender
//body//

const MessageSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    To: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    body: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId, //thjis is just for getting all the message from a particular chat other wise its imposible to get all message we have reference so
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
