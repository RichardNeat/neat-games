const express = require('express');
const app = express();
app.use(express.json());

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
    customErrors,
    psqlErrors,
} = require('./error-handling');

// Categories
app.get('/api/categories', getCategories);

// Reviews
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewById)
app.patch('/api/reviews/:review_id', newVote);

// Users
app.get('/api/users', getUsers);

app.use(psqlErrors);
app.use(customErrors);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'bad path'})
    });


module.exports = app;