const db = require('../db/connection');

exports.selectReviewById = (review_id) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [review_id])
        .then((response) => {
            if(response.rowCount === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "not found"
                });
            };
            return response.rows[0];
        });
};

exports.updateVote = (review_id, updatedReview) => {
    const {inc_votes} = updatedReview;
    return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;', [inc_votes, review_id])
        .then((response) => {
            if(response.rowCount === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "not found"
                });
            };
            return response.rows[0];
        });
};