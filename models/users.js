const db = require('../db/connection');

exports.selectUsers = () => {
    return db.query('SELECT * FROM users;')
        .then(({rows: users}) => {
            return users;
        });
};