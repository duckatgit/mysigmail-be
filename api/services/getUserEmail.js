const { OAuth2Client } = require("google-auth-library");
async function getEmailFromIdToken(idToken) {
  try {
    const client = new OAuth2Client(
      "838689770783-92j7imng6gsq9q2iau523tu9k44cvffe.apps.googleusercontent.com"
    );
    const ticket = await client.verifyIdToken({
      idToken,
      audience:
        "838689770783-92j7imng6gsq9q2iau523tu9k44cvffe.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    const userEmail = payload.email; // Extract user's email
    return userEmail;
  } catch (error) {
    console.error("Error decoding ID token:", error.message);
    throw error;
  }
}

module.exports = { getEmailFromIdToken };
