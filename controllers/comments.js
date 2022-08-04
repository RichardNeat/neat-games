const {
    selectCommentsByReviewId,
    insertCommentById,
    deleteCommentById,
    updateCommentVote,
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

exports.postCommentById = (req, res, next) => {
    const id = req.params.review_id;
    const newComment = req.body;
    insertCommentById(id, newComment).then((comment) => {
        res.status(201).send({comment});
    })
    .catch(next)
};

exports.removeCommentById = (req, res, next) => {
    const id = req.params.comment_id;
    deleteCommentById(id).then(() => {
        res.status(204).send();
    })
    .catch(next);
};

exports.addCommentVote = (req, res, next) => {
    const id = req.params.comment_id;
    const updateComment = req.body;
    updateCommentVote(id, updateComment).then((comment) => {
        res.status(200).send({comment});
    })
    .catch(next);
};