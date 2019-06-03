const { articlesData, commentsData, topicsData, usersData } = require('../data');
const { convertingToPsqlTimeStamp } = require('../../utils/index')

// console.log

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
      .then(() => {
        console.log(convertingToPsqlTimeStamp(articlesData))
        return knex.insert(convertingToPsqlTimeStamp(articlesData))
        .into("articles")
        .returning("*")
      })
      .then(() => {
        return knex.insert(convertingToPsqlTimeStamp(commentsData))
        .into("articles")
        .returning("*")
      })
  };
  