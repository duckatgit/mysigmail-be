const express = require("express");
const router = express.Router();
const {
  uploadImg,
  getSignDetails,
  updateImageLink,
} = require("../controllers/signatureController.js");
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
      cb(null, Date.now().toString());
    },
  }),
});

router.post("/upload-img/:userId", upload.single("image"), uploadImg);
router.get("/get-sign-details/:userId", getSignDetails);
router.post("/update-img-link/:userId", updateImageLink);

module.exports = router;
