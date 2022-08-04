const apiRouter = require('express').Router();
const usersRouter = require('./users-router.js');
const categoriesRouter = require('./categories-router.js');
const commentsRouter = require('./comments-router.js');
const reviewsRouter = require('./reviews-router.js');

apiRouter.use('/users', usersRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;