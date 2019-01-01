const fs = require("fs");

let config;

try {
  config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
} catch (e) {
  config = {
    interval: 1000,
    preassure: "GP",
    humidity: "GH",
    temperature: "GT"
  };
}

console.log(config);
