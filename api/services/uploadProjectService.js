const users = require("../models/usersModel");
const signatureDetails = require("../models/signatureDetailsModel");

module.exports = {
    uploadProjectData,
  getSignDetailsUser,
  updateImageLinkUser,
};

async function uploadProjectData(payload, fileLink) {
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
          const filterSignature = { userId: userId };

          const isSignatureExist = await signatureDetails.findOne(
            filterSignature
          );
          const data = {
            userId: payload.userId,
            projectURL: fileLink,
          };
          if (isSignatureExist) {
            data.updatedAt = new Date();
            const update = await signatureDetails.findOneAndUpdate(
              filterSignature,
              data,
              {
                new: true,
              }
            );
            if (update) {
              const show = {
                message: "Image uploaded successfully",
                imageUrl: fileLink,
              };
              return resolve({
                status: 200,
                data: show,
              });
            } else {
              return resolve({ status: 500, data: "Server Error!" });
            }
          } else {
            var query = new signatureDetails(data);
            const result = await query.save();
            if (result) {
              const show = {
                message: "Image uploaded successfully",
                projectUrl: fileLink,
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

async function getSignDetailsUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const userId = payload.userId;
      const filter = { userId };
      const isSignatureExist = await signatureDetails.findOne(filter);
      if (isSignatureExist) {
        return resolve({
          status: 200,
          data: isSignatureExist,
        });
      } else {
        return resolve({
          status: 501,
          data: "Signature doesn't exist!",
        });
      }
    } catch (error) {
      return reject(error);
    }
  });
}

async function updateImageLinkUser(payload, fileURL) {
  return new Promise(async function (resolve, reject) {
    try {
      const userId = payload.userId;
      const filter = { userId };
      const isSignatureExist = await signatureDetails.findOne(filter);
      if (isSignatureExist) {
        const data = {
          userId: payload.userId,
          imgURL: fileURL,
        };
        const update = await signatureDetails.findOneAndUpdate(filter, data, {
          new: true,
        });

        
        if (update) {
          const show = {
            message: "Image updated successfully",
            imageUrl: fileURL,
          };
          return resolve({
            status: 200,
            data: show,
          });
        } else {
          return resolve({ status: 500, data: "Server Error!" });
        }
      } else {
        return resolve({
          status: 501,
          data: "Signature doesn't exist!",
        });
      }
    } catch (error) {
      return reject(error);
    }
  });
}
