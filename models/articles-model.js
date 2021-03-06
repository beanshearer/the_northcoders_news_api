const connection = require("../db/connection");

const fetchArticle = ({ article_id }) => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comments.article_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id })
    .first()
    .then(article => {
      if (!article)
        return Promise.reject({ status: 404, message: "article not found" });
      else return article;
    });
};

const increaseVote = ({ article_id }, { inc_votes = 0 }) => {
  return connection("articles")
    .where({ article_id: article_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(article => {
      if (article.length < 1) {
        return Promise.reject({ status: 404, message: "article not found" });
      } else return article[0];
    });
};

const addComment = ({ article_id }, username, body) => {
  return connection("comments")
    .insert({ author: username, article_id, body })
    .returning("*")
    .then(comment => {
      if (comment.length < 1) {
        return Promise.reject({ status: 400, message: "comment not added" });
      } else return comment[0];
    });
};

const fetchComments = (
  { article_id },
  { sort_by = "created_at", order = "desc", limit = 10, p = 0 }
) => {
  return connection
    .select("comment_id", "author", "votes", "created_at", "body")
    .from("comments")
    .where({ article_id: article_id })
    .orderBy(sort_by, order)
    .returning("*")
    .limit(limit)
    .offset(p)
    .then(comments => {
      if (comments.length < 1) {
        return Promise.reject({ status: 404, message: "no comments found" });
      } else return comments;
    });
};

const fetchArticles = ({
  sort_by = "articles.created_at",
  order = "desc",
  author,
  topic,
  limit = 10,
  p = 0
}) => {
  return Promise.all([
    connection
      .select(
        "articles.author",
        "articles.title",
        "articles.article_id",
        "articles.created_at",
        "articles.votes",
        "articles.topic"
      )
      .from("articles")
      .count({ comment_count: "comments.article_id" })
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .groupBy("articles.article_id")
      .modify(query => {
        if (author) query.where({ "articles.author": author });
        if (topic) query.where({ "articles.topic": topic });
      })
      .limit(limit)
      .offset(p)
      .orderBy(sort_by, order),
    connection("articles")
      .modify(query => {
        if (author) query.where({ "articles.author": author });
        if (topic) query.where({ "articles.topic": topic });
      })
      .count("article_id")
  ]).then(([articles, [{ count }]]) => {
    if (count < 1) {
      return Promise.reject({ status: 404, message: "no articles" });
    } else return { articles, count };
  });
};

const checkTopicOrColumnExists = ({ topic, sort_by = "*" }) => {
  return connection
    .select(sort_by)
    .from("articles")
    .modify(query => {
      if (topic) query.where({ topic });
    })
    .then(top => {
      if (top.length < 1) {
        return Promise.reject({ status: 404, message: "no topic" });
      } else return top;
    });
};

module.exports = {
  fetchArticle,
  increaseVote,
  addComment,
  fetchComments,
  fetchArticles,
  checkTopicOrColumnExists
};
