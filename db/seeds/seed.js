const { articleData, commentsData, topicsData, usersData } = require('../data');

exports.seed = (knex, Promise) => {
    return knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => { 
        return knex.insert(topicsData)
        .into("topics")
        .returning("*")
      })
      .then(() => {
        return knex.insert(usersData)
        .into("users")
        .returning("*")
      })
  };
  