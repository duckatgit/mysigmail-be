const verifyOTPTemplate = (firstName, otp, verificationURL) => {
  const message = `<div>
    <p>Hi ${firstName},</p>
    <p>Please verify your email by using the OTP below:</p>
    <h1>OTP: ${otp}</h1>
    <a href="${verificationURL}" style="text-decoration: underline;
    color: #5656eb;">Verification Link</a>
    <p>Thanks for using our service!</p>
  </div>`;
  return message;
};

module.exports = { verifyOTPTemplate };
