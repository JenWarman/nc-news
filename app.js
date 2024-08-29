const express = require('express');
const app = express();
const { getAllTopics, getAllEndPoints, getArticlesById, getAllArticles, getCommentsByArticleId, postNewComment, updateArticleById } = require('./controllers/topics.controllers')
app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndPoints);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postNewComment);

app.patch('/api/articles/:article_id', updateArticleById);


module.exports = app;