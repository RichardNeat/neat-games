const db = require('../db/connection');

exports.selectCommentsByReviewId = (review_id) => {
    return db.query('SELECT * FROM comments WHERE review_id = $1;', [review_id])
        .then((response) => {
            return response.rows;
        });
};

exports.insertCommentById = (review_id, newComment) => {
    const {username, body} = newComment;
    return db.query('INSERT INTO comments (author, body, review_id, votes, created_at) VALUES ($1, $2, $3, 0, $4) RETURNING *;', [username, body, review_id, new Date])
        .then(({rows: [comment]}) => {
            return comment;
        });
};

exports.deleteCommentById = (id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [id])
        .then((response) => {
            if (response.rowCount === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "not found"
                });
            };
        });
};

exports.updateCommentVote = (id, updateComment) => {
    const {inc_vote} = updateComment;
    return db.query('UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;', [inc_vote, id])
        .then((response) => {
            if (response.rowCount === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "not found"
                });
            };
            return response.rows[0];
        });
};