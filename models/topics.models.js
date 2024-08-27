const db = require('../db/connection')
const endpoints = require('../endpoints.json')
const fs = require('fs/promises');
const { promises } = require()
const format = require("pg-format")

exports.fetchAllTopics = () => {
    return db.query(`SELECT * FROM topics`)
        .then(({ rows }) => {
            return { rows };
        })
}

exports.fetchAllEndPoints = () => {
    return fs.readFile('./endpoints.json', 'utf-8')
        .then((data) => {
            const parsedData = JSON.parse(data);
            return parsedData;
        })
        .catch((err) => {
            return err;
        })
}

exports.fetchArtcilesById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        return rows;
    })
}