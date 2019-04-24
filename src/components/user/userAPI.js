class UserAPI {
    constructor(userDAL, models) {
        this.auth = require("../auth")(models);
        this.userDAL = userDAL;
        this.models = models;
    }

    async getAll(req, res, next) {
        let result = await this.userDAL.getAll();
        res.send(result);
    }

    async getByID(req, res, next) {
        try {
            this.auth.authenticate(req, res, next);
            const id = req.params.id;
            const user = await this.userDAL.getByID(id);
            res.send(user);
        } catch (e) {
            return false;
        }
    }

    async post(req, res, next) {
        const userContext = req.body;

        return await this.userDAL.insert(userContext);
    }
}

module.exports = UserAPI;
