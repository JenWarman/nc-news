const db = require('../db/connection')

exports.fetchAllTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        // console.log(body.rows, '<----body in model')
        return {rows};
    })
}