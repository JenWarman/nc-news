const express = require('express');
const app = express();
const { getAllTopics, getAllEndPoints, getArticlesById, getAllArticles, getCommentsByArticleId, postNewComment } = require('../controllers/topics.controllers')
app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndPoints)

app.get('/api/articles/:article_id', getArticlesById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postNewComment)

app.use((err, request, response, next) => {
    if (err.status === 404) {
        response.status(404).send({ msg: "Request not found" });
    }
    if (err.code === '22P02') {
        response.status(400).send({ msg: "Bad request" });
    }
    next();
})

module.exports = app;