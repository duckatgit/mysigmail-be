const {
  failAction,
  successAction,
  customAction,
} = require("../utils/response");
const {
  signupUser,
  verifyEmailUser,
  resendVerifyEmailUser,
} = require("../services/authService");

exports.signup = async function (req, res) {
  const payload = req.body;
  let result;
  try {
    result = await signupUser(payload);
    res
      .status(result.status)
      .json(successAction(result.data, "Account created successfully"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

exports.verifyEmail = async function (req, res) {
  const payload = req.body;
  let result;
  try {
    result = await verifyEmailUser(payload);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

exports.resendVerifyEmail = async function (req, res) {
  const payload = req.body;
  let result;
  try {
    result = await resendVerifyEmailUser(payload);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
