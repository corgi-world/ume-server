const express = require("express");
var router = express.Router();

const scriptObjects = require("../../scriptObjects");

const openings = "openings";
const contents = "contents";
const closings = "closings";

router.post("/get", function(req, res) {
  let s = {};

  const scriptType = req.body.scriptType;
  if (scriptType === openings) {
    const day = req.body.day;
    s = scriptObjects.openings["day" + day];
  } else if (scriptType === contents) {
    const isPositivie = req.body.isPositivie
      ? "P"
      : "N";
    const event = req.body.event;
    const day = req.body.day;
    const contentCount = req.body.contentCount;

    const flow =
      isPositivie + "_" + event + "_" + day;
    console.log(flow);
  }

  res.send(s);
});

module.exports = router;
