const routes = require("./loginRoutes.js");
const router = require("express").Router();
const LoginAPI = require("./loginAPI.js");
const UserDAL = require("../user/userDAL.js");

module.exports = userDAL => {
    const auth = require("../auth")(userDAL);
    const login = new LoginAPI(auth);

    return routes(router, login);
}
