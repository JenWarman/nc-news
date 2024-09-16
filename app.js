const express = require('express');
const cors = require('cors');
app.use(cors());
const app = express();
const { getAllTopics, getAllEndPoints, getArticlesById, getAllArticles, getCommentsByArticleId, postNewComment, updateArticleById, deleteCommentById, getAllUsers } = require('./controllers/topics.controllers')
app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndPoints);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postNewComment);

app.patch('/api/articles/:article_id', updateArticleById);

app.delete('/api/comments/:comment_id', deleteCommentById)

app.get('/api/users', getAllUsers)

module.exports = app;