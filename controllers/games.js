const categories = require('../db/data/test-data/categories');
const {
    selectCategories,
    selectReviewById,
} = require('../models/games');

exports.getCategories = (req, res, next) => {
    selectCategories().then((categories) => {
        res.status(200).send({categories});
    });
};

exports.getReviewById = (req, res, next) => {
    const review_id = req.params.review_id;
    selectReviewById(review_id).then((review) => {
        console.log(review)
        res.status(200).send({review});
    }).catch(next);
};