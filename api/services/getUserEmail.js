const { OAuth2Client } = require("google-auth-library");
async function getEmailFromIdToken(idToken) {
  try {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userEmail = payload.email; // Extract user's email
    const fullName = payload.name;
    return { email: userEmail, name: fullName };
  } catch (error) {
    console.error("Error decoding ID token:", error.message);
    throw error;
  }
}

module.exports = { getEmailFromIdToken };
