const express = require('express');
const app = express();

const {
    getCategories,
    getReviewById,
} = require('./controllers/games');

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewById)

app.all('*', (req, res) => {
    res.status(404).send({msg: 'bad path'})
    });

///////////////////////////////////////////
// EHMF's

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: 'bad request'});
    } else next(err);
});

app.use((err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({msg: err.msg});
    };
});








module.exports = app;