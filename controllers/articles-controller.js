const { fetchArticle, increaseVote, addComment, fetchComments } = require('../models/articles-model')

const sendArticle = (req, res, next) => {
    fetchArticle(req.params).then(article => {
        res.status(200).send({ article })
    }).catch(err => next(err))
}

const updatedArticle = (req, res, next) => {
    increaseVote(req.params, req.body).then(article => {
        res.status(200).send({ article })
    }).catch(err => next(err))
}

const updatedComment = (req, res, next) => {
    addComment(req.params, req.body.username, req.body.body).then(comment => {
        res.status(200).send({ comment })
    }).catch(err => next(err))
}

const sendComments = (req, res, next) => {
    console.log('simon')
    fetchComments(req.params).then(comments => {
        res.status(200).send({ comments })
    }).catch(err => next(err))
}

module.exports = { sendArticle, updatedArticle, updatedComment, sendComments }