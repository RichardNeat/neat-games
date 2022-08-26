const userRouter = require('express').Router();

const {
    getUsers,
    getUserByUsername,
    postUser,
} = require('../controllers/users');

userRouter.route('/')
.get(getUsers)
.post(postUser);

userRouter.route('/:username')
.get(getUserByUsername);

module.exports = userRouter;