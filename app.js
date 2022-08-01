const express = require('express');
const app = express();
app.use(express.json());

const {
    getCategories,
} = require('./controllers/games');

app.get('/api/categories', getCategories);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'bad path'})
    });

///////////////////////////////////////////
// EHMF's








module.exports = app;