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

exports.insertUser = ({username, name, avatar_url}) => {
    return db.query(`INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3) RETURNING *`, [username, name, avatar_url])
        .then((response) => {
            return response.rows[0];
        });
};

exports.deleteUser = (username) => {
    return db.query('DELETE FROM users WHERE username = $1 RETURNING *', [username])
        .then((response) => {
            if (response.rowCount === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "not found"
                });
            }
            // console.log(response.rows);
        });
};