const { failAction, successAction } = require("../utils/response");
const { signupUser } = require("../services/authService");

const signup = async (req, res) => {
  const payload = req.body;
  let result;
  try {
    result = await signupUser(payload);
    res.status(result.status).json(successAction(result.data, "Account created successfully"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};


module.exports =  signup