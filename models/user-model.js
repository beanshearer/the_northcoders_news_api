const connection = require("../db/connection");

const fetchUser = () => {
    return connection
        .select("*")
        .from("users")
        .then(user => {
            console.log(user)
            return user
        });
}

module.exports = { fetchUser }