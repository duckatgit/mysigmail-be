const verifyOTPTemplate = (firstName, otp) => {
  const message = `<div>
  <p>Hi, ${firstName}. Please verify your email, by entering the below OTP</p>
<h1>OTP: ${otp}</h1>
  </div>`;
  return message;
};

module.exports = { verifyOTPTemplate };
