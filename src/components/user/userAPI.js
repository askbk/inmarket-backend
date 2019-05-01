class UserAPI {
    constructor(userController, auth) {
        this.userController = userController;
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
        //  Authenticate user and decode token
        let token;
        try {
            token = await this.auth.authenticate(req, res, next);
            if (!token) {
                res.status(401).send({
                    success: false,
                    message: "Not logged in with a valid token"
                });
                return false;
            }
        } catch (e) {
            return false;
        }

        //  Get id of the user that is to be modified
        const userId = req.params.id

        //  Make sure that users only modify their own profiles
        if (userId !== token.sub) {
            res.status(403).send({
                success: false,
                message: "Not allowed to edit another user's profile"
            });

            return false;
        }

        //  Values to be updated
        const userContext = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            description: req.body.description,
            id: userId
        };

        //  Attempt to do update profile
        try {
            const success = await this.userController.updateProfile(userContext);

            if (success) {
                res.status(200).send({
                    success: true,
                    message: "Successful profile update"
                });

                return true;
            }

            res.status(500).send({
                success: false,
                message: "Unknown error when updating profile"
            });

            return false;
        } catch(e) {
            res.status(500).send({
                success: false,
                message: `Error when updating profile: ${e}`
            });

            return false;
        }
    }
}

module.exports = UserAPI;
