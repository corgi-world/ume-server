const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({ extended: false })
);

const mysql = require("mysql");
const connection = mysql.createConnection({
  user: "root",
  password: "12345678",
  database: "audio"
});

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
      cb(null, file.originalname);
    }
  }),
  limits: { fileSize: 500 * 1024 * 1024 }
});

app.post(
  "/save",
  upload.single("audio"),
  function(req, res) {
    const { fileName, fileTime } = req.body;

    connection.query(
      "INSERT INTO files (fileName, fileTime) VALUES (?, ?)",
      [fileName, fileTime],
      err => {
        if (err) {
          console.log(err);
          res.send({ result: "Error" });
        } else {
          res.send({ result: "OK" });
        }
      }
    );
  }
);

app.post("/get", function(req, res) {
  connection.query(
    "SELECT * FROM files",
    function(err, files) {
      if (err) {
        res.send({ result: "Error" });
      } else {
        res.send({
          files,
          result: "OK"
        });
      }
    }
  );
});

app.listen(3000, function() {
  connection.connect();
  console.log("server start");
});