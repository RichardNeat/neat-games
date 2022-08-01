const categories = require('../db/data/test-data/categories');
const {
    selectCategories,
    selectReviewById,
    updateVote,
} = require('../models/games');

exports.getCategories = (req, res, next) => {
    selectCategories().then((categories) => {
        res.status(200).send({categories});
    });
};

exports.getReviewById = (req, res, next) => {
    const review_id = req.params.review_id;
    selectReviewById(review_id).then((review) => {
        res.status(200).send({review});
    }).catch(next);
};

exports.newVote = (req, res, next) => {
    const review_id = req.params.review_id;
    const updatedReview = req.body;
    updateVote(review_id, updatedReview).then((review) => {
        res.status(201).send({review});
    }).catch(next);
};