const express = require("express");
var router = express.Router();

const scriptObjects = require("../../scriptObjects");

const openings = "openings";
const contents = "contents";
const closings = "closings";

const mysql = require("mysql");
/*
const connection = mysql.createConnection({
  user: "root",
  password: "12345678",
  database: "ume_test"
});
*/

const connection = mysql.createConnection({
  user: "msw",
  password: "msw1234",
  database: "ume_test"
});

router.post("/get", function(req, res) {
  let s = {};

  const scriptType = req.body.scriptType;
  if (scriptType === openings) {
    const day = req.body.day;
    console.log("day" + day);
    s = scriptObjects.openings["day" + day];
    res.send(s);
    return;
  } else if (scriptType === contents) {
    const {
      id,
      name,
      sentiment,
      event,
      day,
      contentCount
    } = req.body;

    var e = "";
    if (event == "대인관계") {
      e = "A";
    } else if (event == "학업") {
      e = "B";
    } else if (event == "직장") {
      e = "C";
    } else if (event == "취업") {
      e = "D";
    } else if (event == "잘모르겠어") {
      e = "E";
    }

    console.log(sentiment);
    console.log(event);
    console.log(contentCount);

    const flow = sentiment + "_" + e + "_" + day;
    console.log(flow);
    const contentKey =
      scriptObjects.flows[flow][contentCount];

    console.log(contentKey);

    if (contentKey == undefined) {
      s = scriptObjects.closings["day" + day];
      res.send(s);
      return;
    } else {
      s = scriptObjects.contents[contentKey];
      res.send(s);

      const date = new Date().toString();
      connection.query(
        "INSERT INTO script (id, name, scriptName, date) VALUES (?, ?, ?, ?)",
        [id, name, contentKey, date],
        err => {
          if (err) {
            console.log(err);
          } else {
          }
        }
      );

      return;
    }
  }
});

module.exports = router;
