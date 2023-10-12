const users = require("../models/usersModel");
const { emailSender } = require("./emailSender");
const { verifyOTPTemplate } = require("../templates/verifyOTP.template");
const { generateRandomNumber } = require("../utils/common");

module.exports = {
  signupUser,
  verifyEmailUser,
  resendVerifyEmailUser,
};

async function signupUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const email = payload?.email;
      const isEmailExist = await users.find({ email: email });

      if (isEmailExist.length > 0) {
        return reject("User already exists!");
      } else {
        const OTP = generateRandomNumber();
        let data = {
          firstName: payload?.firstName,
          lastName: payload?.lastName,
          gender: payload?.gender,
          email: payload?.email,
          password: payload.password,
          OTP: OTP,
        };
        var query = new users(data);
        const result = await query.save();

        if (result) {
          const emailTemplate = verifyOTPTemplate(payload?.firstName, OTP);

          emailSender(email, "Verify OTP", emailTemplate);
          return resolve({ status: 200, data: result });
        } else {
          return resolve({ status: 500, data: "Server Error!" });
        }
      }
    } catch (error) {
      return resolve(error);
    }
  });
}

async function verifyEmailUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const email = payload?.email;
      const user = await users.findOne({ email: email });

      if (user) {
        if (user.isVerified) {
          return resolve({
            status: 409,
            data: "Your email has been already verified",
          });
        } else {
          if (payload.OTP === user.OTP) {
            const data = {
              isVerified: true,
              updatedAt: new Date(),
            };
            const filter = { email: email };
            const update = await users.findOneAndUpdate(filter, data, {
              new: true,
            });
            if (update) {
              return resolve({
                status: 200,
                data: "Email has been verified successfully",
              });
            } else {
              return resolve({ status: 500, data: "Server Error!" });
            }
          } else {
            return resolve({
              status: 501,
              data: "Invalid OTP, Please try again",
            });
          }
        }
      } else {
        return resolve({ status: 500, data: "No user found!" });
      }
    } catch (error) {
      return resolve(error);
    }
  });
}

async function resendVerifyEmailUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const email = payload?.email;
      const filter = { email: email };
      const user = await users.findOne(filter);
      const OTP = generateRandomNumber();

      const data = {
        OTP: OTP,
        updatedAt: new Date(),
      };
      const update = await users.findOneAndUpdate(filter, data, {
        new: true,
      });

      const emailTemplate = verifyOTPTemplate(user?.firstName, OTP);

      emailSender(email, "Verify OTP", emailTemplate);
      return resolve({
        status: 200,
        data: "Email has been sent successfully",
      });
    } catch (error) {
      return resolve(error);
    }
  });
}
