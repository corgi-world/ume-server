const express = require("express");
const app = express();

const emojiStrip = require("emoji-strip");

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
/*
const connection = mysql.createConnection({
  user: "msw",
  password: "msw1234",
  database: "ume_test"
});
*/

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
    const {
      id,
      name,
      day,
      sentimentText,
      eventText,
      recordingText,
      fileName,
      fileTime
    } = req.body;
    const date = new Date().toString();

    var r = emojiStrip(recordingText);

    connection.query(
      "INSERT INTO recording (id, name, day, sentimentText, eventText, recordingText, fileName, fileTime, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        name,
        day,
        sentimentText,
        eventText,
        r,
        fileName,
        fileTime,
        date
      ],
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

const scriptRouter = require("./routes/script/script.js");
app.use("/script", scriptRouter);

const readScript = require("./readScript");

app.get("/test", function(req, res) {
  const now = new Date();
  res.send(now.toString());
});

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
  const now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  const loginDate = Math.floor(diff / oneDay);

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
        if (isIdDuplicated) {
          res.send({
            result: "OK",
            isIdDuplicated
          });
        } else {
          connection.query(
            "INSERT INTO user (id, name, loginDate) VALUES (?, ?, ?)",
            [id, name, loginDate],
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

  console.log("getDate");
  console.log(info);

  connection.query(
    "SELECT loginDate FROM user WHERE id = ?",
    [id],
    function(err, d) {
      if (err) {
        console.log(err);
        res.send({ result: "Error" });
      } else {
        const loginDate = d[0].loginDate;
        res.send({ result: "OK", loginDate });
      }
    }
  );
});

app.post("/saveInput", function(req, res) {
  const {
    id,
    name,
    day,
    sentimentText,
    eventText,
    type,
    text
  } = req.body;
  const date = new Date().toString();

  var t = emojiStrip(text);

  connection.query(
    "INSERT INTO input (id, name, day, sentimentText, eventText, type, text, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      name,
      day,
      sentimentText,
      eventText,
      type,
      t,
      date
    ],
    err => {
      if (err) {
        console.log(err);
        res.send({ result: "Error" });
      } else {
        res.send({ result: "OK" });
      }
    }
  );
});
