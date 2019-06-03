const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');

apiRouter
  .route('/topics/')
  .get((req, res) => res.send({ ok: true }))
  .all(methodNotAllowed);

module.exports = apiRouter;
