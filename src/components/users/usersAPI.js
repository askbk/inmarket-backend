const UsersDAL = require("./usersDAL.js");
const usersDAL = new UsersDAL();

module.exports = class UsersAPI {
    constructor() {}

    async getAll(req, res, next) {
        let result = await usersDAL.getAll();
        console.log(result);
        res.send(result);
    }

    async getByID(req, res, next) {
        const id = req.params.id;

        const user = await usersDAL.getByID(id);
        res.send(JSON.stringify(user));
    }

    async post(req, res, next) {
        const userContext = req.body;

        return usersDAL.insert(userContext);
    }
}
