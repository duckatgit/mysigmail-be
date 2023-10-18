const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

module.exports = {
  createToken,
  verifyToken,
};

// Function to create jwt token
async function createToken(data, duration) {
  return new Promise(async function (resolve, reject) {
    try {
      if (duration) {
        const token = jwt.sign(data, secret, { expiresIn: duration });
        return resolve(token);
      } else {
        const token = jwt.sign(data, secret);
        return resolve(token);
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to verify jwt token
async function verifyToken(token) {
  return new Promise(async function (resolve, reject) {
    try {
      const splitToken = token.split(" ")[1];

      const decoded = jwt.verify(splitToken, secret);
      return resolve(decoded);
    } catch (error) {
      return reject(error);
    }
  });
}
