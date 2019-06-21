const {
  articlesData,
  commentsData,
  topicsData,
  usersData
} = require("../data");
const {
  convertToPsqlTimeStamp,
  titleIdKeyPair,
  replaceArticleId,
  changeKeyToAuthor
} = require("../../utils/index");

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return Promise.all([
        knex
          .insert(topicsData)
          .into("topics")
          .returning("*"),
        knex
          .insert(usersData)
          .into("users")
          .returning("*")
      ]);
    })
    .then(() => {
      return knex
        .insert(convertToPsqlTimeStamp(articlesData))
        .into("articles")
        .returning("*");
    })
    .then(articles => {
      const idTitle = titleIdKeyPair(articles);
      const replacedWithId = replaceArticleId(commentsData, idTitle);
      const withTimeStamp = convertToPsqlTimeStamp(replacedWithId);
      const withAuthor = changeKeyToAuthor(withTimeStamp);
      return knex
        .insert(withAuthor)
        .into("comments")
        .returning("*");
    });
};
