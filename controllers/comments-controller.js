const { updateCommentVote, deleteComment } = require('../models/comments-model')

const updatedComment = (req, res, next) => {
    updateCommentVote(req.params, req.body).then(comment => {
        res.status(200).send({ comment })
    }).catch(err => next(err))
}

const handleCommentToDelete = (req, res, next) => {
    deleteComment(req.params).then(()=> {
        res.status(204).send()
    }).catch(err => next(err))
}

module.exports = { updatedComment, handleCommentToDelete }
