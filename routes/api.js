const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { sendTopics } = require('../controllers/topics-controller');
const { sendUser } = require('../controllers/user-controller');
const articlesRouter = require('./articles')

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
  


module.exports = apiRouter;
