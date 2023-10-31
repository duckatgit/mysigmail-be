const mongoose = require("mongoose");

const signDetailsModel = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    imgURL: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("signature-details", signDetailsModel);
