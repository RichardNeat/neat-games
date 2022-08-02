exports.psqlBasicErrors = ((err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23502') {
        res.status(400).send({msg: 'bad request'});
    } else next(err);
});

exports.psqlComplexErrors = ((err, req, res, next) => {
    if (err.code === '23503') {
        res.status(404).send({msg: "value not found"})
    } else next(err);
})

exports.customErrors = ((err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({msg: err.msg});
    };
});