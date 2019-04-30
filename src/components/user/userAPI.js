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
            const authenticated = await this.auth.authenticate(req, res, next);
            if (authenticated) {
                const id = req.params.id;
                const user = await this.userDAL.getByID(id);
                res.status(200).send(user);
            }
        } catch (e) {
            return false;
        }
    }

    async post(req, res, next) {
        const userContext = req.body;

        return await this.userDAL.insert(userContext);
    }

    async create(req, res, next) {
        const { firstName, lastName, password, email } = req.body;
        const passwordHash = await this.auth.hash(password);

        try {
            this.userDAL.create(
                firstName,
                lastName,
                email,
                passwordHash
            );

            res.status(200).send({
                success: true,
                message: "User created"
            });
        } catch (e) {
            res.status(500).send({
                success: false,
                message: "Error when creating user"
            });
        }
    }

    //  Send contact request from one user to another
    async contact(req, res, next) {
        const contactee = req.params.id;
        const contacterToken = req.body.jwt;

    }
}

module.exports = UserAPI;
