const { failAction, customAction } = require("../utils/response");
const {
  uploadImgUser,
  getSignDetailsUser,
  updateImageLinkUser,
} = require("../services/signatureServices");
const { logErrorToMongoDB } = require("../services/logError");

exports.uploadImg = async function (req, res) {
  try {
    const payload = req.params;
    const fileLink = req.file.location;
    let result;

    result = await uploadImgUser(payload, fileLink);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
    logErrorToMongoDB("uploadImg", error);
  }
};

exports.getSignDetails = async function (req, res) {
  try {
    const payload = req.params;
    let result;
    result = await getSignDetailsUser(payload);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
    logErrorToMongoDB("getSignDetails", error);
  }
};

exports.updateImageLink = async function (req, res) {
  try {
    const payload = req.params;
    const fileURL = req.body.imageLink;
    let result;

    result = await updateImageLinkUser(payload, fileURL);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
    logErrorToMongoDB("updateImageLink", error);
  }
};
