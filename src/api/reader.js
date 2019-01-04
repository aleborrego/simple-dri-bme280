const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

const readAll = path =>
  new Promise((resolve, reject) => {
    let parameterRead;
    let next = 0;
    const commands = ["preassure", "humidity", "temperature"];

    const result = { preassure: null, humidity: null, temperature: null };

    const port = new SerialPort(path, {
      baudRate: 115200
    });
    const readOne = parameter => {
      parameterRead = parameter;
      let command;
      switch (parameter) {
        case "preassure":
          command = "GP";
          break;
        case "temperature":
          command = "GT";
          break;
        case "humidity":
          command = "GH";
          break;
        case "name":
          command = "GN";
          break;
        default:
          console.log("Unknown command");
      }

      console.log("command", command);

      port.write(`${command}\n\n`, err => {
        console.log("written");
        if (err) {
          console.log("Error on write: ", err.message);
        }
      });
    };

    port.on("error", err => {
      console.log("Error: ", err.message);
      readOne(commands[next]);
    });

    const parser = new Readline();
    port.pipe(parser);
    parser.on("data", data => {
      console.log(`${parameterRead}: ${data}`);
      if (next < 2) {
        next += 1;
        readOne(commands[next]);
      } else {
        next = 0;
        resolve(result);
        // setTimeout(() => readOne(commands[next]), 1000);
      }
    });

    readOne(commands[next]);
  });

module.exports = readAll;
