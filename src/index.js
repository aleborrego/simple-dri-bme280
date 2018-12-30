const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

let parameterRead;
let next = 0;
const commands = ["preassure", "humidity", "temperature"];

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

  port.write(`${command}\n\n`, function(err) {
    console.log("written");
    if (err) {
      console.log("Error on write: ", err.message);
    }
  });
};

// const readAll = () => {
//   setTimeout(() => readOne("preassure"), 1000);
//   // setTimeout(() => readOne("humidity"), 2000);
//   // setTimeout(() => readOne("temperature"), 3000);
//   // setTimeout(() => readOne("name"), 4000);
//   // setTimeout(() => readAll(), 5000);
// };

const port = new SerialPort("/dev/ttyACM0", {
  baudRate: 115200
});

port.on("error", function(err) {
  console.log("Error: ", err.message);
  readOne(commands[next]);
});

const parser = new Readline();
port.pipe(parser);
parser.on("data", data => {
  // console.log("read");
  console.log(`${parameterRead}: ${data}`);
  next = next < 2 ? next + 1 : 0;
  setTimeout(() => readOne(commands[next]), 1000);
});

// port.on("readable", function() {
//   console.log("Data:", port.read());
// });
//
// readOne("preassure")

readOne(commands[next]);
