const {
    selectCommentsByReviewId,
} = require('../models/comments');

const {
    checkExists,
} = require('../checkExists')

exports.getCommentsByReviewId = (req, res, next) => {
    const id = req.params.review_id;
    Promise.all([
        selectCommentsByReviewId(id),
        checkExists("reviews", "review_id", id)
    ])
        .then(([comments]) => {
        res.status(200).send({comments});
    })
    .catch(next);
};