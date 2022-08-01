const {
    selectUsers,
} = require('../models/users');

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users});
    });
};