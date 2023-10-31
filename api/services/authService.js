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
      const email = payload?.email.toLowerCase();
      const isEmailExist = await users.find({ email: email });

      if (isEmailExist.length > 0) {
        return resolve({
          status: 409,
          data: "Email already exist!",
        });
      } else {
        const OTP = generateRandomNumber();
        const password = payload.password;
        const salt = 10;
        const hashPassword = await bcrypt.hash(password, salt);

        let data = {
          firstName: payload?.firstName,
          lastName: payload?.lastName,
          gender: payload?.gender,
          email: email,
          password: hashPassword,
          OTP,
        };
        var query = new users(data);
        const result = await query.save();

        if (result) {
          const verificationURL = `http://ec2-54-208-227-113.compute-1.amazonaws.com:8080/verify-email?email=${email}`;
          const emailTemplate = verifyOTPTemplate(
            payload?.firstName,
            OTP,
            verificationURL
          );

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
      const email = payload?.email.toLowerCase();
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
      const email = payload?.email.toLowerCase();
      const filter = { email: email };
      const user = await users.findOne(filter);

      if (user) {
        if (user.isVerified) {
          return resolve({ status: 409, data: "Account is already verified!" });
        } else {
          const OTP = generateRandomNumber();

          const data = {
            OTP,
            updatedAt: new Date(),
          };
          await users.findOneAndUpdate(filter, data, {
            new: true,
          });
          const verificationURL = `http://127.0.0.1:5177/verify-email?email=${email}`;

          const emailTemplate = verifyOTPTemplate(
            user?.firstName,
            OTP,
            verificationURL
          );

          emailSender(email, "Verify OTP", emailTemplate);
          return resolve({
            status: 200,
            data: "Email has been sent successfully",
          });
        }
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
      const email = payload?.email.toLowerCase();
      const filter = { email: email };
      const user = await users.findOne(filter);
      if (user) {
        if (!user.isVerified) {
          return resolve({
            status: 401,
            data: "Account is not verified!",
          });
        } else {
          const password = payload.password;
          const storedHashedPassword = user.password;
          const isPasswordMatch = await bcrypt.compare(
            password,
            storedHashedPassword
          );
          if (isPasswordMatch) {
            const data = {
              userId: user?._id,
              firstName: user?.firstName,
              lastName: user?.lastName,
              gender: user?.gender,
              email: user?.email,
            };
            const token = await createToken(data, 3600);

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
        }
      } else {
        return resolve({
          status: 501,
          data: "Email not register, Please signup first",
        });
      }
    } catch (error) {
      return reject(error);
    }
  });
}

async function forgotPasswordUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const email = payload.email.toLowerCase();
      const filter = { email: email };
      const user = await users.findOne(filter);
      if (user) {
        if (!user.isVerified) {
          return resolve({
            status: 401,
            data: "Account is not verified!",
          });
        } else {
          const emailTemplate = setPasswordTemplate(user?.firstName, email);
          const subject = "Password Reset Request";
          emailSender(email, subject, emailTemplate);
          return resolve({
            status: 200,
            data: "Email has been sent successfully",
          });
        }
      } else {
        return resolve({
          status: 501,
          data: "Email doesn't exist!",
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
      const email = payload.email.toLowerCase();
      const filter = { email: email };
      const user = await users.findOne(filter);
      if (user) {
        if (!user.isVerified) {
          return resolve({
            status: 401,
            data: "Account is not verified!",
          });
        } else {
          const password = payload.password;
          const storedHashedPassword = user.password;
          const isPasswordMatch = await bcrypt.compare(
            password,
            storedHashedPassword
          );
          if (isPasswordMatch) {
            return resolve({
              status: 409,
              data: "New password cannot be same as old password!",
            });
          } else {
            const salt = 10;
            const hashPassword = await bcrypt.hash(password, salt);

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
