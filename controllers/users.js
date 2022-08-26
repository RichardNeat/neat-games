const {
    selectUsers,
    selectUserByUsername,
    insertUser,
    deleteUser,
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
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
    insertUser(req.body). then((user) => {
        res.status(201).send({user});
    }).catch(next);
};

exports.removeUser = (req, res, next) => {
    const username = req.params.username;
    deleteUser(username).then(() => {
        res.status(204).send();
    }).catch(next);
};