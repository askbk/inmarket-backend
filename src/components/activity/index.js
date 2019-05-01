const routes        = require("./activityRoutes.js");
const ActivityAPI   = require("./activityAPI.js");
const ActivityController   = require("./activityController.js");
const router        = require("express").Router();

module.exports = models => {
    const activityController = new ActivityController(models);
    const activities = new ActivityAPI(activityController, models);

    return routes(router, activities);
}
