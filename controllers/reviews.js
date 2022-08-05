const { checkExists } = require('../checkExists');
const {
    selectReviewById,
    updateVote,
    selectReviews,
    insertReview,
    deleteReview,
} = require('../models/reviews');

exports.getReviewById = (req, res, next) => {
    const review_id = req.params.review_id;
    selectReviewById(review_id).then((review) => {
        res.status(200).send({review});
    }).catch(next);
};

exports.addVote = (req, res, next) => {
    const review_id = req.params.review_id;
    const updatedReview = req.body;
    updateVote(review_id, updatedReview).then((review) => {
        res.status(200).send({review});
    }).catch(next);
};

exports.getReviews = (req, res, next) => {
    const {sort_by, order, category, limit, p} = req.query;
    if(category) {
        Promise.all([
            selectReviews(sort_by, order, category, limit, p),
            checkExists("categories", "slug", category)
        ])
        .then(([reviews]) => {res.status(200).send({reviews})
        })
        .catch(next);
    } else selectReviews(sort_by, order, category, limit, p).then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch(next);
};

exports.postReview = (req,res,next) => {
    const newReview = req.body;
    insertReview(newReview).then((review) => {
        res.status(201).send({review});
    })
    .catch(next);
};

exports.removeReview = (req, res, next) => {
    const id = req.params.review_id
    deleteReview(id).then(() => {
        res.status(204).send();
    })
    .catch(next);
};