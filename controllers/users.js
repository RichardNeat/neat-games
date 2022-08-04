const {
    selectUsers,
    selectUserByUsername,
} = require('../models/users');

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users});
    });
};

exports.getUserByUsername = (req, res, next) => {
    const username = req.params.username;
    selectUserByUsername(username).then((user) => {
        res.status(200).send({user});
    });
};