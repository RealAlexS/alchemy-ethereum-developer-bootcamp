const fs = require("fs");
const path = require("path");

function writeFile(directory, filename, data) {
  // Create the directory if it doesn't exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // Write data to the file
  const filePath = path.join(directory, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log(`Data written to ${filePath}`);
}

function loadFile(directory, filename) {
  // Load data from the file
  const filePath = path.join(directory, filename);

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } else {
    console.error(`File ${filePath} does not exist`);
    return null;
  }
}

module.exports = { writeFile, loadFile };
