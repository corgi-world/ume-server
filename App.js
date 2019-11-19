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
  database: "ume_test"
});

app.use(
  "/getAudio",
  express.static(__dirname + "/audio")
);
app.use(
  "/gifs",
  express.static(__dirname + "/gifs")
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

    /*
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
    );*/

    res.send({ result: "OK" });
  }
);

const scriptRouter = require("./routes/script/script.js");
app.use("/script", scriptRouter);

const readScript = require("./readScript");

var fs = require("fs");
app.listen(3000, function() {
  connection.connect();

  const openings = "./scripts/openings/";
  fs.readdirSync(openings).forEach(file => {
    readScript.read("openings", file);
  });
  const contents = "./scripts/contents/";
  fs.readdirSync(contents).forEach(file => {
    readScript.read("contents", file);
  });
  const closings = "./scripts/closings/";
  fs.readdirSync(closings).forEach(file => {
    readScript.read("closings", file);
  });
  const flows = "./scripts/flows/";
  fs.readdirSync(flows).forEach(file => {
    readScript.read("flows", file);
  });

  console.log("server start");
});

/*
  datebase
*/

app.post("/login", function(req, res) {
  const info = req.body;
  const id = info.id;
  const name = info.name;
  const recentDate = "0";

  console.log(info);

  connection.query(
    "SELECT COUNT(*) FROM user WHERE id = ?",
    [id],
    function(err, count) {
      if (err) {
        console.log(err);
        res.send({ result: "Error" });
      } else {
        const c = count[0]["COUNT(*)"];
        const isIdDuplicated = c > 0;
        console.log(isIdDuplicated);
        if (isIdDuplicated) {
          res.send({
            result: "OK",
            isIdDuplicated
          });
        } else {
          connection.query(
            "INSERT INTO user (id, name, recentDate) VALUES (?, ?, ?)",
            [id, name, recentDate],
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
      }
    }
  );
});

app.post("/getDate", function(req, res) {
  const info = req.body;
  const id = info.id;

  console.log(info);

  connection.query(
    "SELECT recentDate FROM user WHERE id = ?",
    [id],
    function(err, d) {
      if (err) {
        console.log(err);
        res.send({ result: "Error" });
      } else {
        const recentDate = d[0].recentDate;
        res.send({ result: "OK", recentDate });
      }
    }
  );
});
