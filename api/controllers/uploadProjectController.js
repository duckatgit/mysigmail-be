const { failAction, customAction } = require("../utils/response");
const {
  uploadProjectUser
} = require("../services/signatureServices");

exports.uploadJson = async function (req, res) {
  try {
    const payload = req.params;
    const fileLink = req.file.location;
    let result;

    result = await uploadProjectUser(payload, fileLink);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};