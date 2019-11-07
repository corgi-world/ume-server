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
    const sentiment = req.body.sentiment;
    const event = req.body.event;
    const day = req.body.day;
    const contentCount = req.body.contentCount;

    const flow =
      sentiment + "_" + event + "_" + day;
    const contentKey =
      scriptObjects.flows[flow][contentCount];

    console.log(sentiment);
    console.log(event);
    console.log(contentKey);
    console.log(contentCount);

    if (contentKey == undefined) {
      s = scriptObjects.closings["day" + day];
    } else {
      s = scriptObjects.contents[contentKey];
    }
  }

  res.send(s);
});

module.exports = router;
