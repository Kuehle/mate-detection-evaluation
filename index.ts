#!/usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));
const { exec } = require("child_process");
const path = require("path");
const util = require("util");
const execPromise = util.promisify(exec);
const fs = require("fs").promises;
const readLastLines = require("read-last-lines");

const logFile = argv["l"] || argv["log"];
const successScript = argv["s"] || argv["success"];
const failScript = argv["f"] || argv["fail"];

interface Input {
  info: {
    imgUrl: string;
  };
  results: Detected[];
}

interface Detected {
  label: string;
  confidence: number;
}

const stdin = process.stdin,
  stdout = process.stdout,
  inputChunks = [];

stdin.resume();
stdin.setEncoding("utf8");

stdin.on("data", function(chunk) {
  inputChunks.push(chunk);
});

stdin.on("end", function() {
  const inputJSON = inputChunks.join();
  const parsedData = JSON.parse(inputJSON);

  main(parsedData);

  const outputJSON = JSON.stringify(parsedData, null, "    ");
  stdout.write(outputJSON);
  stdout.write("\n");
});

const main = async (input: Input) => {
  const isMate = hasMate(input);

  try {
    console.log("Last was success?", await log.isLastSuccess());
  } catch (e) {}
  const date = new Date();
  log.write(
    date.toLocaleString("en-GB"),
    "|",
    "Mate is " + (isMate ? "available" : "NOT available right now")
  );

  try {
    const result = await execPromise(isMate ? successScript : failScript);
  } catch (e) {
    if (
      e.message !==
      'The "file" argument must be of type string. Received type undefined'
    )
      console.error(e);
  }
};

// returns if there is still mate in the fridge
const hasMate = (input: Input): Boolean => {
  return Boolean(
    input.results.find(
      result => result.label === "bottle" && result.confidence >= 0.5
    )
  );
};

const log = {
  write: (...values: any) => {
    console.log(...values);
    const str = values.join("") + "\n";
    return fs.appendFile(logFile, str);
  },
  isLastSuccess: async () => {
    const lastLines = await readLastLines.read(logFile, 1);
    return !Boolean(lastLines.match(/NOT/));
  }
};

// const formatDate = (date: Date) => {
//     return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_`
// }
