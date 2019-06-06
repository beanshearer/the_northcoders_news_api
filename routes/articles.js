const articlesRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { sendArticle, updatedArticle, updatedComment, sendComments } = require('../controllers/articles-controller');

articlesRouter
    .route('/:article_id/')
    .get(sendArticle)
    .patch(updatedArticle)
    .all(methodNotAllowed);

articlesRouter
    .route('/:article_id/comments')
    .post(updatedComment)
    .get(sendComments)
    .all(methodNotAllowed);

module.exports = articlesRouter