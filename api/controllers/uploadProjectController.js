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
const { logErrorToMongoDB } = require("../services/logError");
const User = require("../models/usersModel");

exports.uploadJson = async function (req, res) {
  try {
    const payload = req.params;
    const fileLink = req.file.location;
    let result;

    result = await uploadProjectUser(payload, fileLink);
    res.status(result.status).json(customAction(result));
  } catch (error) {
    res.status(400).json(failAction(error));
    logErrorToMongoDB("uploadJson", error);
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
    res.status(500).json({ message: "Error fetching projectUrl" });
    logErrorToMongoDB("getJson", error);
  }
};

exports.deleteProject = async function (req, res) {
  const projectId = req.params.id;
  try {
    const deletionResult = await deleteProjectUrl(projectId);
    res.json(deletionResult);
  } catch (error) {
    logErrorToMongoDB("deleteProject", error);
  }
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
    logErrorToMongoDB("sendSignTemplate", error);
  }
};

exports.sendSignatureTemplateDemo = async function (req, res) {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  // Initialize OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  try {
    // Construct the authorization URL with the OpenID Connect scope
    const authorizationUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/gmail.settings.basic",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
    });

    // Redirect the user to the authorization URL
    res.send({ url: authorizationUrl });
  } catch {
    res.status(400).json(failAction(error));
    logErrorToMongoDB("sendSignatureTemplateDemo", error);
  }
};

exports.googleAuthCallback = async function (req, res) {
  try {
    const { code } = req.body;
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    const { tokens } = await oAuth2Client.getToken(code);
    const accessToken = tokens.access_token;

    // Get user information using the access token
    const userInfo = await getUserInfo(accessToken);

    // Extract the necessary information like email and name
    const email = userInfo.email;
    const name = userInfo.name;
    let existingUser = await User.findOne({ email });

    // If the user doesn't exist, create a new user
    if (!existingUser) {
      let data = {
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1],
        gender: "Unknown",
        email: email,
        password: "password",
      };

      var newUser = new User(data); // Use 'User' instead of 'users'
      const result = await newUser.save();
    }

    res.send({ accessToken, email, name });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user information" });
    logErrorToMongoDB("googleAuthCallback", error);
  }
};

async function getUserInfo(accessToken) {
  const url = "https://www.googleapis.com/oauth2/v2/userinfo";
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

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
    });

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;
    const idToken = tokenResponse.data.id_token; // Retrieve ID token from the response

    const data = await getEmailFromIdToken(idToken);
    const userEmail = data.email;
    const userName = data.name;
    // Update Gmail signature using the obtained tokens
    await updateSignature(accessToken, refreshToken, structure, userEmail);

    // Respond to the client with tokens or perform additional actions
    res.send({
      accessToken,
      refreshToken,
      userName,
      idToken, // Send ID token to the client
    });
  } catch (error) {
    res.status(500).send(error);
    logErrorToMongoDB("signatureCallback", error);
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
  } catch (error) {
    console.error("Error updating signature:", error.message);
    logErrorToMongoDB("updateSignature", error);
  }
}
