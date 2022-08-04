const apiRouter = require('express').Router();
const usersRouter = require('./users-router.js');
const categoriesRouter = require('./categories-router.js');
const commentsRouter = require('./comments-router.js');
const reviewsRouter = require('./reviews-router.js');

apiRouter.use('/users-router.js', usersRouter);
apiRouter.use('/categories-router.js', categoriesRouter);
apiRouter.use('/reviews-router.js', reviewsRouter);
apiRouter.use('/comments-router.js', commentsRouter);

module.exports = apiRouter;