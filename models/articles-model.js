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

const increaseVote = ({ article_id }, { inc_votes = 0 }) => {
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
        .insert({ author:username, article_id, body })
        .returning('*')
        .then(comment => { if (comment.length < 1) {
            return Promise.reject({ status: 400, message: "comment not added" })
            } else return comment[0].body
        });
}

const fetchComments = ({ article_id }, { sort_by = 'created_at' , order = 'desc' } ) => {
    return connection
        .select('comment_id', 'author', 'votes', 'created_at', 'body')
        .from('comments')
        .where({ 'article_id' : article_id })
        .orderBy(sort_by, order)
        .returning('*')
        .then(comment => { return comment });
}

const fetchArticles = ({ sort_by = 'articles.created_at', order = 'desc', author, topic }) => {
    return connection
        .select('articles.author', 'articles.title', 'articles.article_id', 'articles.created_at', 'articles.votes', 'articles.topic')
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

const checkTopicOrColumnExists = ({ topic, sort_by = '*' }) => {
    return connection 
        .select(sort_by)
        .from('articles')
        .modify(query => {
            if (topic) query.where({ topic })
        })
        .then(top => {
            if (top.length < 1) {
                return Promise.reject({ status: 404, message: "no topic" })
            } else return top
        });
}

module.exports = { fetchArticle, increaseVote, addComment, fetchComments, fetchArticles, checkTopicOrColumnExists }
