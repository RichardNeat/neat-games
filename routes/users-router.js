const userRouter = require('express').Router();

const {
    getUsers,
} = require('../controllers/users');

userRouter.route('/')
.get(getUsers);

module.exports = userRouter;