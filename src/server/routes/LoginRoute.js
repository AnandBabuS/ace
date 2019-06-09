const User = require("../model/user");

const signInRoute = (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  User.find({
    username
  }).then(user => {
    if (user.length > 0 && password === user[0].password) {
      req.session.user = username
      res.redirect('/home')
    } else {
      res.send("sign in failed");
    }
  });
};

const signUpRoute = (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);

  User.find({
    username
  }).then(user => {
    if (user.length > 0) {
      res.send("user is already present");
      return;
    } else {
      User.create({ username, password })
        .then(() => {
          console.log("user saved");
          return true;
        })
        .catch(err => {
          console.log(err);
        });
      res.send("sign up route");
    }
  });
};

module.exports = {
  signInRoute,
  signUpRoute
};
