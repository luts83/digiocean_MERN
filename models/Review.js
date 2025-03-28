const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
