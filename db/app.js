const express = require('express');
const app = express();
const { getAllTopics, getAllEndPoints } = require('../controllers/topics.controllers')
app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndPoints)

app.use((err, request, response, next) => {
    // if(err.status === 204) {
    //     response.status(204).send({msg: "No content found"})
    // }
    next()
})

module.exports = app;