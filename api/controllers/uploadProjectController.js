const { failAction, customAction } = require("../utils/response");
const {
  uploadProjectUser,
  getProjectUrl,
  deleteProjectUrl,
  sendSignatureTemplate
} = require("../services/uploadProjectService");

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
exports.getJson = async function (req, res) {
  try {
    const userId = req.params.userId
    const result = await getProjectUrl(userId);
    if (result) {
      res.json({ 
        result
         });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching projectUrl' });
  }
}

exports.deleteProject = async function (req,res){
  const projectId = req.params.id;
  try {
    const deletionResult = await deleteProjectUrl(projectId);
    res.json(deletionResult);
  } catch (error) {
    
  }
}

exports.sendSignTemplate = async function (req, res) {
  const payload = req.body;
  let result;
  try {
    result = await sendSignatureTemplate(payload);
    res.status(result.status)
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
}