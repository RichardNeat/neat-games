const express = require('express');
const app = express();
app.use(express.json());
const apiRouter = require('./routes/api-router.js');
app.use('/api', apiRouter);

const {
    getCategories,
} = require('./controllers/categories');

const {
    getReviews,
    getReviewById,
    newVote,
} = require('./controllers/reviews');

const {
    getUsers,
} = require('./controllers/users');

const {
    getCommentsByReviewId,
    postCommentById,
    removeCommentById,
} = require('./controllers/comments');

const {
    getApis,
} = require('./controllers/apis')

const {
    customErrors,
    psqlBasicErrors,
    psqlComplexErrors,
} = require('./error-handling');

app.get('/api', getApis);

apiRouter.get('/api');

// Categories
app.get('/api/categories', getCategories);

// Reviews
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewById)
app.patch('/api/reviews/:review_id', newVote);

// Users
app.get('/api/users', getUsers);

// Comments
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);
app.post('/api/reviews/:review_id/comments', postCommentById);
app.delete('/api/comments/:comment_id', removeCommentById),

// EHMFs
app.use(psqlBasicErrors);
app.use(psqlComplexErrors);
app.use(customErrors);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'bad path'})
    });

module.exports = app;