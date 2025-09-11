const express = require('express');
const http = require('http');   // Missing import
const chalk = require('chalk'); 
var dotenv = require('dotenv');
const path = require('path');
// const hbs = require('hbs');
const userRoutes = require('./routes/user.routes')
const stockRoutes = require("./routes/stock.routes")
const app = express();
const server = http.createServer(app);
dotenv.config({ path: '.env' });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'hbs');
app.set('view option', { layout: 'layout' });
// hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
require('./db')
app.use(userRoutes)
app.use(stockRoutes)
app.get('/', (req, res) => {
  res.send('server is working fine');
});
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === 'MulterError') return res.status(400).send(err.message);
  res.send(err.message);
});

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
