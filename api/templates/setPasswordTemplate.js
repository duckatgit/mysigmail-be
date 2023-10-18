const setPasswordTemplate = (firstName, email) => {
  const message = `<div>
      <p>Dear ${firstName},</p>
      <h4>You recently requested a password reset for your account</h4>
      <h3>To reset your password, please click the following link</h3>
      <a href="http://localhost:8081/#/set-new-password?email=${email}"> Set New Password</a>
      <h4>If you did not request this reset, please contact our support team</h4>
      <p>Thanks!</p>
    </div>`;
  return message;
};

module.exports = { setPasswordTemplate };
