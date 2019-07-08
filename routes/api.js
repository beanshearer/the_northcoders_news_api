const apiRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { sendUser, sendAllUsers } = require("../controllers/user-controller");
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const {
  updatedComment,
  handleCommentToDelete
} = require("../controllers/comments-controller");
const routes = require("./routes.json")

apiRouter
  .route("/")
  .get((req, res) => { res.send(routes) })
  .all(methodNotAllowed);

apiRouter.use("/topics", topicsRouter);

apiRouter
  .route("/users/:username/")
  .get(sendUser)
  .all(methodNotAllowed);

apiRouter
  .route("/users/")
  .get(sendAllUsers)
  .all(methodNotAllowed);

apiRouter.use("/articles", articlesRouter);

apiRouter
  .route("/comments/:comment_id")
  .patch(updatedComment)
  .delete(handleCommentToDelete)
  .all(methodNotAllowed);

module.exports = apiRouter;
