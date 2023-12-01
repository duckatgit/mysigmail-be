const ErrorLog = require("../models/ErrorLog");
let userDataId;
async function getUserId(userid) {
  userDataId = userid;
}

async function logErrorToMongoDB(apiName, error, payload) {
  try {
    const errorLog = new ErrorLog({
      userId: userDataId ? userDataId : "",
      apiName: apiName,
      errorMessage: error.message,
      stackTrace: error.stack,
    });
    await errorLog.save();
  } catch (err) {
    console.error("Error logging to MongoDB:", err);
  }
}

module.exports = { logErrorToMongoDB, getUserId };
