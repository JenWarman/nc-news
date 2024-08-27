const { fetchAllTopics, fetchAllEndPoints, fetchArtcilesById } = require('../models/topics.models')


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

exports.getAllArticles = (request, response, next) => {
    const { article_id } = request.params;
    fetchArtcilesById(article_id)
        .then((articles) => {
            response.status(200).send({ articles })
        })
        .catch((err) => {
            next(err);
        })
}