class UserAPI {
    constructor(userDAL, models) {
        this.auth = require("../auth")(models);
        this.userDAL = userDAL;
        console.log(userDAL);
        console.log(userDAL.getAll());
        this.models = models;
    }

    async getAll(req, res, next) {
        console.log(this);
        let result = await this.userDAL.getAll();
        console.log(result);
        res.send(result);
    }

    async getByID(req, res, next) {
        const id = req.params.id;

        const user = await this.userDAL.getByID(id);
        res.send(JSON.stringify(user));
    }

    async post(req, res, next) {
        const userContext = req.body;

        return await this.userDAL.insert(userContext);
    }
}

module.exports = UserAPI;
