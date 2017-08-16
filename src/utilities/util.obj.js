const { remote } = require('electron');
const fs = remote.require('fs');

module.exports = {
  importObj: (path) => {
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path);
      console.log(data.toString());
    } else {
      console.log(`File ${path} does not exist.`);
    }
  }
}
