const {
  fetchArticle,
  increaseVote,
  addComment,
  fetchComments,
  fetchArticles,
  checkTopicOrColumnExists
} = require("../models/articles-model");

const sendArticle = (req, res, next) => {
  fetchArticle(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const updatedArticle = (req, res, next) => {
  increaseVote(req.params, req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const updatedComment = (req, res, next) => {
  fetchArticle(req.params)
    .then(() => {
      return addComment(req.params, req.body.username, req.body.body);
    })
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const sendComments = (req, res, next) => {
  fetchArticle(req.params)
    .then(() => {
      return fetchComments(req.params, req.query);
    })
    .then(comments => res.status(200).send({ comments }))
    .catch(next);
};

const sendArticles = (req, res, next) => {
  checkTopicOrColumnExists(req.query)
    .then(() => {
      return fetchArticles(req.query);
    })
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

module.exports = {
  sendArticle,
  updatedArticle,
  updatedComment,
  sendComments,
  sendArticles
};
