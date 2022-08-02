const express = require('express');
const app = express();
app.use(express.json());

const {
    getCategories,
} = require('./controllers/categories');

const {
    getReviewById,
    newVote,
} = require('./controllers/reviews');

const {
    getUsers,
} = require('./controllers/users');

const {
    getCommentsByReviewId,
} = require('./controllers/comments');

const {
    customErrors,
    psqlErrors,
} = require('./error-handling');

app.get('/api/categories', getCategories);

app.get('/api/reviews/:review_id', getReviewById)
app.patch('/api/reviews/:review_id', newVote);

app.get('/api/users', getUsers);

app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);

app.use(psqlErrors);
app.use(customErrors);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'bad path'})
    });

module.exports = app;