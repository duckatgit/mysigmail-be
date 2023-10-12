const users = require("../models/usersModel");

module.exports = {
  signupUser,
};

async function signupUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const email = payload?.email;
      const isEmailExist = await users.find({ email: email });

      if (isEmailExist.length > 0) {
        return reject("User already exist!");
      } else {
        const data = {
          firstName: payload?.firstName,
          lastName: payload?.lastName,
          gender: payload?.gender,
          email: payload?.email,
          password: payload.password,
        };
        var query = new users(data);
        const result = await query.save();
        if (result) {
          return resolve({status: 200, data: result});
        }else{
          return resolve({status: 500, data: "Server Error!"});
        }
      }
    } catch (error) {
      return resolve(error);

    }
  });
}