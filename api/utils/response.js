const status = require("./status");

exports.successAction = successAction;
exports.failAction = failAction;
exports.customAction = customAction;

function successAction(data, message = "OK", isSuccess = true) {
  return { statusCode: status.SUCCESS, data, message, isSuccess };
}

function customAction(data) {
  return { statusCode: data.status, data: data.data};
}

function failAction(message) {
  return { statusCode: status.FAILURE, message };
}
