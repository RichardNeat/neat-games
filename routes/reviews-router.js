const reviewsRouter = require('express').Router();

const {
    getReviews,
    getReviewById,
    addVote,
    postReview,
    removeReview,
} = require('../controllers/reviews');

const {
    getCommentsByReviewId,
    postCommentById,
} = require('../controllers/comments');

reviewsRouter.route('/')
.get(getReviews)
.post(postReview);

reviewsRouter.route('/:review_id')
.get(getReviewById)
.patch(addVote)
.delete(removeReview);

reviewsRouter.route('/:review_id/comments')
.get(getCommentsByReviewId)
.post(postCommentById);

module.exports = reviewsRouter;