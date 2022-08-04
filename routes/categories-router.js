const categoriesRouter = require('express').Router();

const {
    getCategories,
} = require('../controllers/categories');

categoriesRouter.route('/')
.get(getCategories)


module.exports = categoriesRouter;