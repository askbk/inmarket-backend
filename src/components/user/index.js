const Sq = require("sequelize");
const routes = require("./userRoutes.js");
const UserAPI = require("./userAPI.js");
const UserDAL = require("./userDAL.js");
const userModel = require("./userModel.js");

module.exports = sequelize => {
    const Model = Sq.Model;
    class User extends Model {}
    User.init(userModel, {
        sequelize,
        modelName: "user"
    });

    const userDAL = new UserDAL(User);
    const users = new UserAPI(userDAL);
    
    return routes(router, users);
}
