const db = require('../db/connection');

exports.selectCommentsByReviewId = (review_id) => {
    return db.query('SELECT * FROM comments WHERE review_id = $1;', [review_id])
        .then((response) => {
            return response.rows;
        });
};