const testData = require("./testdata.js");
class UserAPI {
    constructor(userController, auth) {
        this.userController = userController;
        this.auth = auth;
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
        const body = {...req.body};

        const userInfo = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phoneNumber: body.phoneNumber,
            municipality: body.municipality,
            userType: body.userType,
        };

        let userContext, skills;

        switch (true) {
            case userInfo.userType === "company":
                userContext = {
                    name: body.name,
                    webpage: body.webpage,
                    registrationCode: body.registrationCode,
                    orgNumber: body.orgNumber,
                    ...userInfo
                };
                break;

            case userInfo.userType === "employee":
                userContext = {
                    role: body.role,
                    skills: body.skills,
                    ...userInfo
                };
                break;
            case userInfo.userType === "jobseeker":
                userContext = {
                    type: body.type,
                    education: body.education,
                    skills: body.skills,
                    ...userInfo
                };
                break;
            default:
                //  error: no usertype given
                break;
        }


        const passwordHash = await this.auth.hash(body.password);

        try {
            await this.userController.create(
                userContext,
                passwordHash
            );

            res.status(200).send({
                success: true,
                message: "User created"
            });
        } catch (e) {
            res.status(500).send({
                success: false,
                message: `Error when creating user: ${e}`
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

    //  Send contact request from one user to another
    async contact(req, res, next) {
        const contactee = req.params.id;
        const contacterToken = req.body.jwt;
    }

    async insertTestData(req, res, next) {
        testData.forEach(user => {
            this.userController.create(user.userContext, user.passwordHash);
        });

        res.status(200);
    }
}

module.exports = UserAPI;
