const db = require('../db/connection');

exports.selectReviewById = (review_id) => {
    return db.query('SELECT reviews.*, COUNT(comments.body) AS comment_count FROM reviews JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;', [review_id])
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
                    msg: "review_id not found"
                });
            };
            return response.rows[0];
        });
};

exports.selectReviews = (sort_by = "created_at", order = "DESC", category) => {  

    const validSortBys = ["title", "designer", "owner", "review_img_url", "review_body", "category", "created_at", "votes", "comment_count"];

    if (!validSortBys.includes(sort_by) || !['ASC', 'DESC'].includes(order)) {
        return Promise.reject({
            status:(400),
            msg: "bad request"
        });
    };

    let queryStr = '';
    let injectArr = [];

    if(category) {
        queryStr = 'WHERE category = $1'
        injectArr.push(category);
    };

    return db.query(`SELECT reviews.*, COUNT(comments.body) AS comment_count FROM reviews LEFT OUTER JOIN comments ON comments.review_id = reviews.review_id ${queryStr} GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`, injectArr)
        .then((response) => {
            if(response.rowCount === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "not found"
                });
            };
            return response.rows;
        });
};