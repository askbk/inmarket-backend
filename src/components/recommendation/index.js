const routes = require('./recommendationRoutes.js');
const Recommend = require('./recommendationController.js');
const RecommendationAPI = require('./recommendationAPI.js');
const router = require('express').Router();

module.exports = models => {
    const auth = require('../auth')(models);
    const recommend = new Recommend(models);
    const recommendation = new RecommendationAPI(recommend, auth);

    return routes(router, recommendation);
};
