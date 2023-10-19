const setPasswordTemplate = (firstName, email) => {
  const message = `<div>
      <p>Dear ${firstName},</p>
      <h4>You recently requested a password reset for your account</h4>
      <h3>To reset your password, please click the following link</h3>
      <a href="http://ec2-54-208-227-113.compute-1.amazonaws.com:8080/set-new-password?email=${email}"> Set New Password</a>
      <h4>If you did not request this reset, please contact our support team</h4>
      <p>Thanks!</p>
    </div>`;
  return message;
};

module.exports = { setPasswordTemplate };
