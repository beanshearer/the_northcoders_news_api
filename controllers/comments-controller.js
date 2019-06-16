const {
  updateCommentVote,
  deleteComment
} = require("../models/comments-model");

const updatedComment = (req, res, next) => {
  updateCommentVote(req.params, req.body)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

const handleCommentToDelete = (req, res, next) => {
  deleteComment(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

module.exports = { updatedComment, handleCommentToDelete };
