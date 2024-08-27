const express = require('express');
const app = express();
const { getAllTopics, getAllEndPoints } = require('../controllers/topics.controllers')
app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndPoints)

module.exports = app;