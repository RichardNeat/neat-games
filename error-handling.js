exports.psqlError = ((err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23502') {
        res.status(400).send({msg: 'bad request'});
    } else next(err);
});

exports.customError = ((err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({msg: err.msg});
    };
});