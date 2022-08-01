const categories = require('../db/data/test-data/categories');
const {
    selectCategories,
} = require('../models/games');

exports.getCategories = (req, res, next) => {
    selectCategories().then((categories) => {
        res.status(200).send({categories});
    })
}