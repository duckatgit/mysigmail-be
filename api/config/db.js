const mongoose = require("mongoose");

// Connection options to handle deprecation warnings
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const password = "ofi1VlXA9LgNMidh";
const clusterURI = "mongodb+srv://duckatgit:" + encodeURIComponent(password) + "@mysigmail.3b9yw2z.mongodb.net/";
// const clusterURI = "mongodb://localhost:27017/mysigmail-db";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(clusterURI, options);
    console.log("Connected to MongoDB Atlas cluster successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas cluster:", error);
  }
};

module.exports = connectToDatabase;
