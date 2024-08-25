const db = require('../db/connection')
const endpoints = require('../endpoints.json')
const fs = require('fs/promises');
const { promises } = require()

exports.fetchAllTopics = () => {
    return db.query(`SELECT * FROM topics`)
        .then(({ rows }) => {
            // if(rows.length === 0) {
            //     return Promise.reject({status: 204, msg: "No content found"})
            // }
            return { rows };
        })
}

exports.fetchAllEndPoints = () => {
    return fs.readFile('./endpoints.json', 'utf-8')
        .then((data) => {
            // console.log(data, '<----data');
            const parsedData = JSON.parse(data);
            // console.log(parsedData, '<--parsed')
            return parsedData;
        })
        .catch((err) => {
            console.log(err)
        })
}