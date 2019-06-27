const { fetchUser, fetchAllUsers } = require("../models/user-model");

const sendUser = (req, res, next) => {
  fetchUser(req.params)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const sendAllUsers = (req, res, next) => {
  console.log("controller");
  fetchAllUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

module.exports = { sendUser, sendAllUsers };
