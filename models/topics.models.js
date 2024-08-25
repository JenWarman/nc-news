const db = require('../db/connection')

exports.fetchAllTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        // if(rows.length === 0) {
        //     return Promise.reject({status: 204, msg: "No content found"})
        // }
        return {rows};
    })
}