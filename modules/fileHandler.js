const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../employees.json");

async function readFile() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
}

async function writeFile(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

module.exports = { readFile, writeFile };