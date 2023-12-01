const mongoose = require("mongoose");

const ErrorLog = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    apiName: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    stackTrace: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("errors", ErrorLog, "Error");
