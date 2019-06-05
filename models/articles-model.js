const connection = require("../db/connection");

const fetchArticle = ({ article_id }) => {
    return connection
        .select('articles.*')
        .from('articles')
        .count({ comment_count: 'comments.article_id'})
        .leftJoin('comments', 'comments.article_id', 'articles.article_id')
        .groupBy('articles.article_id')
        .where({ 'articles.article_id' : article_id })
        .then(article => {
            if (article.length < 1) {
                return Promise.reject({ status: 404, message: "article not found" })
            } else return article[0]
        });
}

module.exports = { fetchArticle }
