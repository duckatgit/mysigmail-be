const users = require("../models/usersModel");
const signatureDetails = require("../models/signatureDetailsModel");
const uploadProject = require("../models/uploadProjectModel");
const { Types } = require('mongoose');
const { emailSender } = require("./emailSender");

module.exports = {
  uploadProjectUser,
  getProjectUrl,
  deleteProjectUrl,
  sendSignatureTemplate
};

async function uploadProjectUser(payload, fileLink) {
  return new Promise(async function (resolve, reject) {
    try {
      const userId = payload.userId;
      const filter = { _id: userId };
      const user = await users.findOne(filter);
      if (user) {
        if (!user.isVerified) {
          return resolve({
            status: 401,
            data: "Account is not verified!",
          });
        } else {
          const data = {
            userId: payload.userId,
            projectURL: fileLink,
          };
            var query = new uploadProject(data);
            const result = await query.save();
            if (result) {
              const show = {
                message: "Project uploaded successfully",
                projectURL: fileLink,
              };
              return resolve({
                status: 200,
                data: show,
              });
            } else {
              return resolve({
                status: 500,
                data: "Server Error!",
              });
            }          
        }
      } else {
        return resolve({
          status: 501,
          data: "User doesn't exist!",
        });
      }
    } catch (error) {
      return reject(error);
    }
  });
}

async function getProjectUrl(userId){
  try {
    const project = await uploadProject.find({ userId: { $in: new Types.ObjectId(userId) } });
    if (project) {
      const projectURLs = project.map(project => project);
      return projectURLs;
    } else {
      return null; 
    }
  } catch (error) {
    throw error;
  }
}

async function deleteProjectUrl(projectId){
  try {
    const deletedProject = await uploadProject.findByIdAndDelete(projectId);
    if (deletedProject) {
      return { message: 'Project URL deleted successfully' };
    } else {
      return { message: 'Project not found' };
    }
  } catch (error) {
    throw error;
  }
}

async function sendSignatureTemplate(payload) {
  const email = payload?.email.toLowerCase();
  const emailTemplate = payload?.emailTemplate;
  try {
    await emailSender(email, "Signature", emailTemplate);
    return {
      status: 200,
      data: "Email has been sent successfully",
    };
  } catch (error) {
    // Handle any errors and possibly throw an error
    throw error;
  }
}