const {
  failAction,
  successAction,
  customAction,
} = require("../utils/response");
const {
  signupUser,
  verifyEmailUser,
  resendVerifyEmailUser,
  signinUser,
  forgotPasswordUser,
  setNewPasswordUser,
} = require("../services/authService");
const { verifyToken } = require("../utils/jwt");
const { logErrorToMongoDB, getUserId } = require("../services/logError");

exports.signup = async function (req, res) {
  const payload = req.body;
  let result;
  try {
    result = await signupUser(payload);
    res.status(result.status);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    logErrorToMongoDB("signup", error);
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
    logErrorToMongoDB("verifyEmail", error);
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
    logErrorToMongoDB("resendVerifyEmail", error);
  }
};

exports.signin = async function (req, res) {
  const payload = req.body;
  let result;
  try {
    result = await signinUser(payload);
    const userIdString = result.data.user.userId.toString();
    getUserId(userIdString);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
    logErrorToMongoDB("signin", error);
  }
};

exports.forgotPassword = async function (req, res) {
  const payload = req.body;
  let result;
  try {
    result = await forgotPasswordUser(payload);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
    logErrorToMongoDB("forgotPassword", error);
  }
};

exports.setNewPassword = async function (req, res) {
  const payload = req.body;
  let result;
  try {
    result = await setNewPasswordUser(payload);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
    logErrorToMongoDB("setNewPassword", error);
  }
};

exports.validateToken = async function (req, res) {
  try {
    const validate = await verifyToken(req.headers?.authorization);
    if (validate) {
      const result = { data: "Validate success" };
      res.status(200).json(customAction(result));
    }
  } catch (error) {
    res.status(401).json(failAction(error));
    logErrorToMongoDB("validateToken", error);
  }
};
