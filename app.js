const express = require('express');
const app = express();
app.use(express.json());
const apiRouter = require('./routes/api-router.js');
app.use('/api', apiRouter);

const {
    getApis,
} = require('./controllers/apis')

const {
    customErrors,
    psqlBasicErrors,
    psqlComplexErrors,
} = require('./error-handling');

app.get('/api', getApis);

// EHMFs
app.use(psqlBasicErrors);
app.use(psqlComplexErrors);
app.use(customErrors);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'bad path'})
    });

module.exports = app;