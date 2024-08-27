const express = require('express');
const app = express();
const { getAllTopics, getAllEndPoints, getAllArticles } = require('../controllers/topics.controllers')
app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndPoints)

app.get('/api/articles/:article_id', getAllArticles)

module.exports = app;