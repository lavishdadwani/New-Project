import express from "express";
import chalk from "chalk";
import http from "http";

const app = express();
const server = http.createServer(app);

server.listen(3000, (err) => {
  if (err) {
    console.log(chalk.red("Cannot run!"));
  } else {
    console.log(
      chalk.green.bold(
        `
        Yep, this is working 🍺
        App is listening on port: ${3000} 🍕
        Env: ${process.env.NODE_ENV} 🦄
      `
      )
    );
  }
});
