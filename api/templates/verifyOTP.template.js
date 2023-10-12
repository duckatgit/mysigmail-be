const verifyOTPTemplate = (firstName, otp) => {
  const message = `<div>
    <p>Hi ${firstName},</p>
    <p>Please verify your email by using the OTP below:</p>
    <h1>OTP: ${otp}</h1>
    <p>Thanks for using our service!</p>
  </div>`;
  return message;
};

module.exports = { verifyOTPTemplate };
