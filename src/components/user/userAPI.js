class UserAPI {
    constructor(userDAL) {
        this.userDAL = userDAL;
    }

    async getAll(req, res, next) {
        let result = await this.usersDAL.getAll();
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

        return this.userDAL.insert(userContext);
    }
}

module.exports = UserAPI;
