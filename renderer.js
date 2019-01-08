const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

let ports = [];

const list = () =>
  SerialPort.list().then(
    result => {
      console.log(JSON.stringify(result));
      result.forEach(port => {
        const select = document.getElementById("select");
        const option = document.createElement("option");
        option.text = port.comName;
        select.add(option);
      });
    },
    err => console.error(err)
  );

const read = path => {
  console.log(path);
  let parameterRead;
  let next = 0;
  const commands = ["preassure", "humidity", "temperature"];

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
    let transformedData = data;
    if (parameterRead === "preassure") {
      transformedData =
        data.substring(0, data.length - 5) + "." + data.substring(data.length - 5, data.length - 3);
    }
    document.getElementById(parameterRead).textContent = transformedData;
    if (next < 2) {
      next += 1;
      readOne(commands[next]);
    } else {
      next = 0;
      setTimeout(() => readOne(commands[next]), 1000);
    }
  });

  readOne(commands[next]);
};

module.exports = { list, read };
