// when user come after login then what ui and what are the field required
// for making chat model
//chat name
//isgroup
//users
//lastmessage
//isadmin

// creating a chat model

const mongoose = require("mongoose");
const chatSchema = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model("chatModel", chatSchema);
module.exports = chatModel;
