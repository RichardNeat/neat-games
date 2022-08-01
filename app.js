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
    customError,
    psqlError,
} = require('./error-handling');

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewById)

app.patch('/api/reviews/:review_id', newVote);

app.use(psqlError);
app.use(customError);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'bad path'})
    });


module.exports = app;