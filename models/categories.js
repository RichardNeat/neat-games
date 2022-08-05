const db = require('../db/connection');

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories;')
        .then(({rows: categories}) => {
            return categories;
        })
}

exports.insertCategory = (newCategory) => {
    const {slug, description} = newCategory;
    return db.query('INSERT INTO categories (slug, description) VALUEs ($1, $2) RETURNING *;', [slug, description])
        .then((response) => {
            return response.rows[0];
        });
};