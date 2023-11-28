const { failAction, customAction } = require("../utils/response");
const {
  uploadProjectUser,
  getProjectUrl,
  deleteProjectUrl,
  sendSignatureTemplate,
} = require("../services/uploadProjectService");
const { getEmailFromIdToken } = require("../services/getUserEmail");
const { google } = require("googleapis");
const gmail = google.gmail("v1");
const axios = require("axios");

exports.uploadJson = async function (req, res) {
  try {
    const payload = req.params;
    const fileLink = req.file.location;
    let result;

    result = await uploadProjectUser(payload, fileLink);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
exports.getJson = async function (req, res) {
  try {
    const userId = req.params.userId;
    const result = await getProjectUrl(userId);
    if (result) {
      res.json({
        result,
      });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projectUrl" });
  }
};

exports.deleteProject = async function (req, res) {
  const projectId = req.params.id;
  try {
    const deletionResult = await deleteProjectUrl(projectId);
    res.json(deletionResult);
  } catch (error) {}
};

exports.sendSignTemplate = async function (req, res) {
  const payload = req.body;
  let result;
  try {
    result = await sendSignatureTemplate(payload);
    res.status(result.status);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

exports.sendSignatureTemplateDemo = async function (req, res) {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const TOKEN_URL = process.env.TOKEN_URL;

  // Initialize OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  // Construct the authorization URL with the OpenID Connect scope
  const authorizationUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.settings.basic",
      "https://www.googleapis.com/auth/userinfo.email", // Include OpenID Connect scope
    ],
  });

  // Redirect the user to the authorization URL
  res.send({ url: authorizationUrl });
};

// Add a new route for handling the callback after the user grants permission
exports.signatureCallback = async function (req, res) {
  const { structure, codeParam } = req.body;
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const TOKEN_URL = process.env.TOKEN_URL;

  // Extract the authorization code from the query parameters
  const code = codeParam;

  // Exchange authorization code for tokens including the ID token
  try {
    const tokenResponse = await axios.post(TOKEN_URL, {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      access_type: "offline",
    });

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;
    const idToken = tokenResponse.data.id_token; // Retrieve ID token from the response

    const userEmail = await getEmailFromIdToken(idToken);

    console.log(userEmail);

    // Update Gmail signature using the obtained tokens
    await updateSignature(accessToken, refreshToken, structure, userEmail);

    // Respond to the client with tokens or perform additional actions
    res.send({
      accessToken,
      refreshToken,
      idToken, // Send ID token to the client
    });
  } catch (error) {
    console.error(
      "Error exchanging authorization code for tokens:",
      error.message
    );
    console.log("Error Response:", error);
    res.status(500).send("Error exchanging authorization code for tokens");
  }
};

// Function to update the Gmail signature
async function updateSignature(
  accessToken,
  refreshToken,
  structure,
  userEmail
) {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  // Set the credentials using the obtained tokens
  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  try {
    const response = await gmail.users.settings.sendAs.update({
      userId: "me",
      sendAsEmail: userEmail,
      resource: {
        signature: structure,
      },
    });

    console.log("Signature updated:", response.data);
  } catch (error) {
    console.error("Error updating signature:", error.message);
  }
}
