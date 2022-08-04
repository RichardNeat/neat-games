const commentsRouter = require('express').Router();

const {
    removeCommentById,
    addCommentVote,
} = require('../controllers/comments');

commentsRouter.route('/:comment_id')
.delete(removeCommentById)
.patch(addCommentVote);



module.exports = commentsRouter;