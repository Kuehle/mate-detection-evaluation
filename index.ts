#!/usr/bin/env node

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
  const inputJSON = inputChunks.join(),
    parsedData = JSON.parse(inputJSON),
    outputJSON = JSON.stringify(parsedData, null, "    ");
  stdout.write(outputJSON);
  stdout.write("\n");
});

const main = (input: Input) => {
  console.log(input);
};
