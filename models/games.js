const db = require('../db/connection');

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories;')
        .then(({rows: categories}) => {
            return categories;
        })
}

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