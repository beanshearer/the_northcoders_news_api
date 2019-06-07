const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { sendTopics } = require('../controllers/topics-controller');
const { sendUser } = require('../controllers/user-controller');
const articlesRouter = require('./articles')
const { updatedComment, handleCommentToDelete } = require('../controllers/comments-controller')

apiRouter
  .route('/topics/')
  .get(sendTopics)
  .all(methodNotAllowed);

apiRouter
  .route('/users/:username/')
  .get(sendUser)
  .all(methodNotAllowed);

apiRouter
  .use('/articles', articlesRouter)

apiRouter
  .route('/comments/:comment_id')
  .patch(updatedComment)
  .delete(handleCommentToDelete)


module.exports = apiRouter;
