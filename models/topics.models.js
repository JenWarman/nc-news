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
}

exports.fetchArtcilesById = (article_id) => {
    let queryString = `SELECT * FROM articles`
    let queryValue = [];
    const regex = /\D/ig;
    if (regex.test(article_id)) {
        return Promise.reject({status: 400, msg: 'Bad request'})
    }
    if (article_id) {
        queryValue.push(article_id);
        queryString += ` WHERE article_id = $1`, [article_id];
    }
    return db.query(`${queryString}`, queryValue)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Request not found' })
            }
            return rows;
        })
}