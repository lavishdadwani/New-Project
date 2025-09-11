const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Auth = async function (req, res, next) {
  try {
    var authToken = req.header('Authorization');
    if (authToken) {
      const user = await User.findOne({ token: authToken });
      if (!user) return res.status(402).send('invalid Credentials middle');
      req.user = user;
      let SecretKey = `${user.email}-${new Date(user.createdAt).getTime()}`;
      if (user.subscribeToken != null) {
        jwt.verify(user.subscribeToken, SecretKey, function (err, payload) {
          if (err) {
            console.log(err);
            user.subscribeToken = null;
            user.isSubscribe = false;
          }
        //   console.log(payload);
        });
      }
      next();
    }
  } catch (err) {
    console.log(err);
    if (err) res.status(402).send('invalid Credentials');
  }
};

module.exports = Auth;