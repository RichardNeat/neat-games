const db = require('./db/connection');
const format = require('pg-format');

const checkExists = (table, column, value) => {
    // console.log("in utils")
    const queryStr = format('SELECT * FROM %I WHERE %I = $1;', table, column);
    return db.query(queryStr, [value])
        .then((response) => {
            if (response.rowCount === 0) {
                return Promise.reject ({
                    status: 404,
                    msg: "not found"
                });
            };
        });
};

module.exports = {
    checkExists,
};