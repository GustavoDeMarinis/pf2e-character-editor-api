// ************************************** HOW TO USE **************************************
// *                                                                                      *
// *     just run in the terminal at the root folder                                      *
// *     of this project the next command line:                                           *
// *     npx ts-node ./prisma/seeders/local/utils/cuid-generator.ts                       *
// *                                                                                      *
// ****************************************************************************************

import cuid from "cuid";
import readline from "readline";

const rl = readline.createInterface(process.stdin, process.stdout);

rl.question("How many ids do you want to generate? ", (quantity) => {
  const ids = Array.from(Array(parseInt(quantity))).map(() => cuid());
  console.log(ids);
  rl.close();
});

rl.on("close", () => {
  console.log("Here you go, enjoy!");
  process.exit(0);
});
