const express = require('express');
const app = require('./app')

app.use(express.json());

app.use((err, request, response, next) => {
    if (err.status === 404) {
        response.status(404).send({ msg: "Request not found" });
    }
    if (err.code === '22P02') {
        response.status(400).send({ msg: "Bad request" });
    }
    if (err.code === '23503') {
        response.status(404).send({ msg: "Request not found" });
    } 
    next();
})

module.exports = app;