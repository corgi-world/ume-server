var fs = require("fs");
const scriptObjects = require("./scriptObjects");

const obj = {
  read: (
    folderName,
    fileName
  ) => {
    fs.readFile(
      "./scripts/" +
        folderName +
        "/" +
        fileName,
      "utf8",
      (
        err,
        data
      ) => {
        const j = JSON.parse(
          data
        );
        // console.log(data);
        // console.log(j);

        const key = fileName.split(
          "."
        )[0];
        scriptObjects[
          folderName
        ][
          key
        ] = j;

        // console.log(scriptObjects);
      }
    );
  }
};

module.exports = obj;
