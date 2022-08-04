const userRouter = require('express').Router();

userRouter.route('/')
.get((req, res) => {
    res.status(200).send('All OK from GET /api/users');
})
.post((req, res) => {
    res.status(200).send('All OK from POST /api/users');
})
.patch((req, res) => {
    res.status(200).send('All OK from PATCH /api/users');
})
.delete((req, res) => {
    res.status(200).send('All OK from DELETE /api/users');
});

module.exports = userRouter;