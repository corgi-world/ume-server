var fs = require("fs");
const scriptObjects = require("./scriptObjects");

const obj = {
  read: (folderName, fileName) => {
    fs.readFile(
      "./scripts/" +
        folderName +
        "/" +
        fileName +
        ".txt",
      "utf8",
      (err, data) => {
        const j = JSON.parse(data);
        console.log(data);
        console.log(j);

        scriptObjects[folderName][fileName] = j;
        console.log(scriptObjects);
      }
    );
  }
};

module.exports = obj;
