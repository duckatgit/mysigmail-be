require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.SERVER_PORT;

const connectToDatabase = require("./api/config/db");
connectToDatabase();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const allowedOrigins = [
    // "http://127.0.0.1:4200",
    // "http://localhost:4200",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// app.use("/api", routes);


app.listen(port, () => {
    console.log(`App listening at Port: ${port}`);
  });

module.exports = app;
