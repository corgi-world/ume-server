const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({ extended: false })
);

app.use(
  "/getAudio",
  express.static(__dirname + "/audio")
);

const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./audio");
    },
    filename: function(req, file, cb) {
      cb(
        null,
        new Date().valueOf() +
          "-" +
          file.originalname
      );
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 }
});

app.post(
  "/save",
  upload.single("audio"),
  function(req, res) {
    console.log(req.body);

    res.send("hello");
  }
);

app.listen(3000, function() {
  console.log("server start");
});
