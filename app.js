const express = require('express');
const app = express();
app.use(express.json());

const {
    getCategories,
    getReviewById,
    newVote,
} = require('./controllers/games');

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewById)

app.patch('/api/reviews/:review_id', newVote);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'bad path'})
    });

///////////////////////////////////////////
// EHMFs

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: 'bad request'});
    } else next(err);
});

app.use((err, req, res, next) => {
    if (err.code === '23502') {
        res.status(400).send({msg: 'bad request'});
    } else next(err);
});

app.use((err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({msg: err.msg});
    };
});








module.exports = app;