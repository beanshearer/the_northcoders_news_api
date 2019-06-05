const { articlesData, commentsData, topicsData, usersData } = require('../data');
const { convertingToPsqlTimeStamp, keyPair, replacingKeys, changeKeyName } = require('../../utils/index');

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
        return knex.insert(convertingToPsqlTimeStamp(articlesData))
        .into("articles")
        .returning("*")
      })
      .then(articles => {
        const idTitle = keyPair(articles); 
        const replacedWithId = replacingKeys(commentsData, idTitle)
        // console.log(replacedWithId)
        const withTimeStamp = convertingToPsqlTimeStamp(replacedWithId)
        const withAuthor = changeKeyName(withTimeStamp);
        return knex.insert(withAuthor)
        .into("comments")
        .returning("*")
      })
  };
  