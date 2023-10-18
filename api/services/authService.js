const users = require("../models/usersModel");
const { emailSender } = require("./emailSender");
const { verifyOTPTemplate } = require("../templates/verifyOTP.template");
const { generateRandomNumber } = require("../utils/common");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/jwt");
const { setPasswordTemplate } = require("../templates/setPasswordTemplate");

module.exports = {
  signupUser,
  verifyEmailUser,
  resendVerifyEmailUser,
  signinUser,
  forgotPasswordUser,
  setNewPasswordUser,
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
        const password = payload.password;
        const salt = 10;
        const hashPassword = await bcrypt.hash(password, salt);

        let data = {
          firstName: payload?.firstName,
          lastName: payload?.lastName,
          gender: payload?.gender,
          email: payload?.email,
          password: hashPassword,
          OTP,
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
      return reject(error);
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
      return reject(error);
    }
  });
}

async function resendVerifyEmailUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const email = payload?.email;
      const filter = { email: email };
      const user = await users.findOne(filter);
      if (user) {
        const OTP = generateRandomNumber();

        const data = {
          OTP,
          updatedAt: new Date(),
        };
        await users.findOneAndUpdate(filter, data, {
          new: true,
        });

        const emailTemplate = verifyOTPTemplate(user?.firstName, OTP);

        emailSender(email, "Verify OTP", emailTemplate);
        return resolve({
          status: 200,
          data: "Email has been sent successfully",
        });
      } else {
        return resolve({ status: 500, data: "Email doesn't exist!" });
      }
    } catch (error) {
      return reject(error);
    }
  });
}

async function signinUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const email = payload?.email;
      const filter = { email: email };
      const user = await users.findOne(filter);
      if (user) {
        const password = payload.password;
        const storedHashedPassword = user.password;
        const isPasswordMatch = await bcrypt.compare(
          password,
          storedHashedPassword
        );
        if (isPasswordMatch) {
          const data = {
            firstName: user?.firstName,
            lastName: user?.lastName,
            gender: user?.gender,
            email: user?.email,
          };
          const token = await createToken(data, 60);
          data.token = token;

          const result = {
            user: data,
            message: "Login Success!",
          };
          return resolve({ status: 200, data: result });
        } else {
          return resolve({
            status: 501,
            data: "Invalid Password",
          });
        }
      } else {
        return resolve({
          status: 501,
          data: "Invalid Email",
        });
      }
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
}

async function forgotPasswordUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const email = payload.email;
      const filter = { email: email };
      const user = await users.findOne(filter);
      if (user) {
        const emailTemplate = setPasswordTemplate(user?.firstName, email);
        const subject = "Password Reset Request";
        emailSender(email, subject, emailTemplate);
        return resolve({
          status: 200,
          data: "Email has been sent successfully",
        });
      } else {
        return resolve({
          status: 501,
          data: "Email does't exist!",
        });
      }
    } catch (error) {
      return reject(error);
    }
  });
}

async function setNewPasswordUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const email = payload.email;
      const password = payload.password;
      const salt = 10;
      const hashPassword = await bcrypt.hash(password, salt);
      const filter = { email: email };
      const data = {
        password: hashPassword,
        updatedAt: new Date(),
      };
      const update = await users.findOneAndUpdate(filter, data, {
        new: true,
      });
      if (update) {
        return resolve({
          status: 200,
          data: "Your Password has been updated successfully!",
        });
      } else {
        return resolve({ status: 500, data: "Server Error!" });
      }
    } catch (error) {
      return reject(error);
    }
  });
}
