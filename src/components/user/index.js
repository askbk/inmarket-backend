const routes    = require("./userRoutes.js");
const UserAPI   = require("./userAPI.js");
const UserController   = require("./userController.js");
const router    = require("express").Router();

module.exports = models => {
    const userController = new UserController(models);
    const users = new UserAPI(userController, models);

    return routes(router, users);
}
