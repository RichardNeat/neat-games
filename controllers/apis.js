const {
    selectApis,
} = require('../models/apis');

exports.getApis = (req, res, next) => {
    selectApis().then((apis) => {
        res.status(200).send({apis})
    });
};