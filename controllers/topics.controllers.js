const { fetchAllTopics, fetchAllEndPoints } = require('../models/topics.models')


exports.getAllTopics = (request, response, next) => {
    fetchAllTopics()
        .then((topics) => {
            response.status(200).send(topics);
        })
        .catch((err) => {
            next(err);
        });
};

exports.getAllEndPoints = (request, response) => {
    fetchAllEndPoints()
        .then((endPoints) => {
            // console.log(endPoints, '<----endpoints')
            response.status(200).send(endPoints)
        })
        .catch((err) => {
            next(err);
        });
}