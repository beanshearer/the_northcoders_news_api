const connection = require("../db/connection");

const fetchTopics = () => {
    return connection
        .select("*")
        .from("topics")
        .then(topics => {
            return topics
        });
}

module.exports = { fetchTopics }
