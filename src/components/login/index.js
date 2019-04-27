const routes    = require("./loginRoutes.js");
const router    = require("express").Router();
const LoginAPI  = require("./loginAPI.js");

module.exports = models => {
    const auth = require("../auth")(models);
    const login = new LoginAPI(auth);

    return routes(router, login);
}
