const db = require('../db/connection')
const endpoints = require('../endpoints.json')
const fs = require('fs/promises');
const { promises } = require()

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

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Request not found' })
            }
            return rows;
        })
}

exports.fetchArticles = () => {
    return db.query(`SELECT * FROM articles`)
    .then(({rows}) => {
        console.log(rows)
        // const newObj = {
        //     article_id: 0
        // }
        // const mappedRows = rows.map((value) => {
        //     console.log(value.title, '<---value')
        //     // value.article_id += newObj[article_id];
        //     // return mappedRows;
        // })
        // console.log(newObj, '<----new Object')
        
        console.log(Object.keys(rows[0]), '<---rows in model')
        return rows;
    })
}