const routes    = require("./userRoutes.js");
const UserAPI   = require("./userAPI.js");
const UserDAL   = require("./userDAL.js");
const router    = require("express").Router();

module.exports = models => {
    const userDAL = new UserDAL(models.User);
    const users = new UserAPI(userDAL, models);

    return routes(router, users);
}
