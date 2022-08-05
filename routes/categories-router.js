const categoriesRouter = require('express').Router();

const {
    getCategories,
    postCategory,
} = require('../controllers/categories');

categoriesRouter.route('/')
.get(getCategories)
.post(postCategory)


module.exports = categoriesRouter;