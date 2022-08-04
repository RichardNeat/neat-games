const reviewsRouter = require('express').Router();

const {
    getReviews,
    getReviewById,
    addVote,
} = require('../controllers/reviews');

const {
    getCommentsByReviewId,
    postCommentById,
} = require('../controllers/comments');

reviewsRouter.route('/')
.get(getReviews);

reviewsRouter.route('/:review_id')
.get(getReviewById)
.patch(addVote);

reviewsRouter.route('/:review_id/comments')
.get(getCommentsByReviewId)
.post(postCommentById);

module.exports = reviewsRouter;