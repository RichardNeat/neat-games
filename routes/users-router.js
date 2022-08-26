const userRouter = require('express').Router();

const {
    getUsers,
    getUserByUsername,
    postUser,
    removeUser,
} = require('../controllers/users');

userRouter.route('/')
.get(getUsers)
.post(postUser);

userRouter.route('/:username')
.get(getUserByUsername)
.delete(removeUser);

module.exports = userRouter;