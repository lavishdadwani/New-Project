var mongoose = require('mongoose');
const chalk = require('chalk'); 
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((res) =>  console.log(
    chalk.green.bold('DB connected')
  ))
  .catch((err) => console.log(err));