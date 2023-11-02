const express = require("express");
const router = express.Router();
const {
  uploadJson,
  getJson,
  deleteProject,
  sendSignTemplate
} = require("../controllers/uploadProjectController");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/aws-config.js");

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const stringWithoutSpaces = file.originalname.replace(/\s/g, '');
      cb(null, stringWithoutSpaces);
    },
  }),
});

router.post("/upload-project/:userId", upload.single("project"), uploadJson);
router.get("/projectUrl/:userId",getJson)
router.delete("/deleteProject/:id",deleteProject)
router.post("/sendTemplate",sendSignTemplate)

module.exports = router;
