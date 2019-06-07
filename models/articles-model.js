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

const increaseVote = ({ article_id }, { inc_votes }) => {
    return connection('articles')
        .where({ 'article_id' : article_id })
        .increment('votes', inc_votes)
        .returning('*')
        .then(article => { if (article.length < 1) {
            return Promise.reject({ status: 404, message: "article not found" })
            } else return article[0]
        });
}

const addComment = ({ article_id }, username, body) => {
    return connection('comments')
        .insert({author:username, article_id, body})
        .returning('*')
        .then(comment => { if (comment.length < 1) {
            return Promise.reject({ status: 400, message: "comment not added" })
            } else return comment[0].body
        });
}

const fetchComments = ({ article_id }, { sort_by = 'comment_id' , order = 'asc' } ) => {
    return connection
        .select('comment_id', 'author', 'votes', 'created_at', 'body')
        .from('comments')
        .where({ 'article_id' : article_id })
        .orderBy(sort_by, order)
        .returning('*')
        .then(comment => { if (comment.length < 1) {
            return Promise.reject({ status: 400, message: "article has no comments or does not exist" })
            } else return comment
        });
}

const fetchArticles = ({ sort_by = 'article_id', order = 'asc', author, topic }) => {
    return connection
        .select('articles.*')
        .from('articles')
        .count({ comment_count: 'comments.article_id'})
        .leftJoin('comments', 'comments.article_id', 'articles.article_id')
        .groupBy('articles.article_id')
        .modify((query) => {
            if (author) query.where({ 'articles.author' : author })
            if (topic) query.where({ 'articles.topic' : topic })
        })
        .orderBy(sort_by, order)
        .then(articles => {
            if (articles.length < 1) {
                return Promise.reject({ status: 404, message: "no articles" })
            } else return articles
        });
}


module.exports = { fetchArticle, increaseVote, addComment, fetchComments, fetchArticles }
