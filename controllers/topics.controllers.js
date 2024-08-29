const { fetchAllTopics, fetchAllEndPoints, fetchArticleById, fetchArticles, fetchComments, addComment } = require('../models/topics.models')


exports.getAllTopics = (request, response, next) => {
    fetchAllTopics()
        .then((topics) => {
            response.status(200).send(topics);
        })
        .catch((err) => {
            next(err);
        });
};

exports.getAllEndPoints = (request, response, next) => {
    fetchAllEndPoints()
        .then((endPoints) => {
            response.status(200).send(endPoints)
        })
        .catch((err) => {
            next(err);
        });
}

exports.getArticlesById = (request, response, next) => {
    const { article_id } = request.params;
    fetchArticleById(article_id)
        .then((article) => {
            response.status(200).send(article)
        })
        .catch((err) => {
            next(err);
        })
}

exports.getAllArticles = (request, response, next) => {
    fetchArticles()
        .then((articles) => {
            response.status(200).send({ articles })
        })
        .catch((err) => {
            next(err);
        })
}

exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    fetchComments(article_id)
        .then((comments) => {
            response.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        })
}

exports.postNewComment = (request, response, next) => {
    const { article_id } = request.params
    const { username, body } = request.body
    addComment(article_id, username, body)
        .then((comment) => {
            response.status(200).send({ comment });
        })
        .catch((err) => {
            next(err);
        })
}