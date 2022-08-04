const db = require('../db/connection');

exports.selectUsers = () => {
    return db.query('SELECT * FROM users;')
        .then(({rows: users}) => {
            return users;
        });
};

exports.selectUserByUsername = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1;', [username])
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