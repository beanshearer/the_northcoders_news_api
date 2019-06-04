const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { sendTopics } = require('../controllers/topics-controller');
const { sendUser } = require('../controllers/user-controller');

apiRouter
  .route('/topics/')
  .get(sendTopics)
  .all(methodNotAllowed);

apiRouter
  .route('/users/:username')
  .get(sendUser)
  .all(methodNotAllowed);


module.exports = apiRouter;
