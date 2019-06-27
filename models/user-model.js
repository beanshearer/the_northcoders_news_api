const connection = require("../db/connection");

const fetchUser = ({ username }) => {
  return connection
    .select("*")
    .from("users")
    .where({ username })
    .then(user => {
      if (user.length < 1) {
        return Promise.reject({ status: 404, message: "user not found" });
      } else return user[0];
    });
};

const fetchAllUsers = () => {
  return connection
    .select("username")
    .from("users")
    .then(users => {
      if (users.length < 1) {
        return Promise.reject({ status: 404, message: "user not found" });
      } else return users;
    });
};

module.exports = { fetchUser, fetchAllUsers };
