const db = require('../db/connection')
const endpoints = require('../endpoints.json')
const fs = require('fs/promises');
const format = require("pg-format");

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
    const allFromArticles = db.query(`SELECT * FROM articles ORDER BY created_at DESC`);
    const getCommentCount = db.query(`SELECT article_id, COUNT(*)::INT FROM comments GROUP BY article_id`)
    const promises = [allFromArticles, getCommentCount];
    return Promise.all(promises).then(([articles, comments]) => {
        const articleObject = articles.rows.map((article_row) => {
            const commentRow = comments.rows.find((row) => {
                return article_row.article_id === row.article_id
            });
            return {
                "author": article_row.author,
                "title": article_row.title,
                "article_id": article_row.article_id,
                "topic": article_row.topic,
                "created_at": article_row.created_at,
                "votes": article_row.votes,
                "article_img_url": article_row.article_img_url,
                "comment_count": commentRow ? commentRow.count : 0,
            }
        });
        return articleObject;
    });
}

exports.fetchComments = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id])
        .then(({ rows }) => {
            return rows;
        })
}

exports.addComment = (article_id, username, body) => {
    return db.query(
        `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
        [article_id, username, body],
    )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Request not found' })
            }
            return rows
        })
}

exports.updateVoteCount = (article_id, inc_votes) => {
    return db.query(`UPDATE articles SET votes = votes+$1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Request not found' })
            }
            return rows;
        })
}

exports.deleteComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
}
