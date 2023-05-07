const mongoose = require("mongoose");
// creating a signup schema ..
const FeebackSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      trim: true,
    },
    rating: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("Feedback", FeebackSchema);
module.exports = User;
