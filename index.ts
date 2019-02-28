#!/usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));
const { exec } = require("child_process");
const path = require("path");
const util = require("util");
const execPromise = util.promisify(exec);

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
  const successScript = argv["s"] || argv["success"];
  const failScript = argv["f"] || argv["fail"];

  const isMate = hasMate(input);

  console.log(
    new Date(),
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
