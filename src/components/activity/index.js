const routes        = require("./activityRoutes.js");
const ActivityAPI   = require("./activityAPI.js");
const ActivityDAL   = require("./activityDAL.js");
const router        = require("express").Router();

module.exports = models => {
    const activityDAL = new ActivityDAL(models);
    const activities = new ActivityAPI(activityDAL, models);

    return routes(router, activities);
}
