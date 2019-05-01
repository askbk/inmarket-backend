class UserAPI {
    constructor(userController, models) {
        this.auth = require("../auth")(models);
        this.userController = userController;
        this.models = models;
    }

    async getByID(req, res, next) {
        try {
            const authenticated = await this.auth.authenticate(req, res, next);
            if (authenticated) {
                const id = req.params.id;
                const user = await this.userController.getByID(id);
                res.status(200).send(user);
            }
        } catch (e) {
            return false;
        }
    }

    async create(req, res, next) {
        const { firstName, lastName, password, email } = req.body;
        const passwordHash = await this.auth.hash(password);

        try {
            this.userController.create(
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

    async updateProfile(req, res, next) {
        const { firstName, lastName, description } = req.body;

        try {
            // TODO: implement a method to update info
        } catch(e) {

        }
    }
}

module.exports = UserAPI;
