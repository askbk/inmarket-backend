const routes = require('./qualityRoutes.js');
const QualityAPI = require('./qualityAPI.js');
const QualityController = require('./qualityController.js');
const router = require('express').Router();

module.exports = models => {
    const qualityController = new QualityController(models);
    const qualities = new QualityAPI(qualityController);

    return routes(router, qualities);
};
