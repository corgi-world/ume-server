var fs = require("fs");
const scriptObjects = require("./scriptObjects");

const obj = {
  read: (folderName, fileName) => {
    if (fileName == ".DS_Store") {
    } else {
      fs.readFile(
        "./scripts/" +
          folderName +
          "/" +
          fileName,
        "utf8",
        (err, data) => {
          try {
            const j = JSON.parse(data);
            // console.log(data);
            // console.log(j);

            const key = fileName.split(".")[0];
            scriptObjects[folderName][key] = j;

            // console.log(scriptObjects);
          } catch (e) {
            console.log(fileName);
          }
        }
      );
    }
  }
};

module.exports = obj;

/*
    if (folderName == "contents") {
      const s = data
        .split("10000")
        .join("1000");
      console.log(s);

      fs.writeFileSync(
        "./scripts/" +
          folderName +
          "/" +
          fileName,
        s,
        "utf8"
      );
    }
*/
