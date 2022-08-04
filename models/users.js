const db = require('../db/connection');

exports.selectUsers = () => {
    return db.query('SELECT * FROM users;')
        .then(({rows: users}) => {
            return users;
        });
};

exports.selectUserByUsername = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1;', [username])
        .then(({rows: [user]}) => {
            return user;
        });
};