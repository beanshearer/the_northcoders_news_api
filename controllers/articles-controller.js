const { fetchArticle } = require('../models/articles-model')

const sendArticle = (req, res, next) => {
    fetchArticle(req.params).then(article => {
        res.status(200).send({ article })
    }).catch(err => next(err))
}

module.exports = { sendArticle }