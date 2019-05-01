const TokenIssuer   = require('./token.js');

class Auth {
    constructor(authController) {
        this.tokenIssuer = new TokenIssuer();
        this.authController = authController;
        this.bcrypt = require("bcrypt");
        this.saltRounds = 10;
    }

    async authenticate(req, res, next) {
        const token = req.headers.authorization;

        if (token) {
            try {
                const decoded = await this.tokenIssuer.verify(token);
                if (decoded) {
                    console.log(decoded);
                }

                return true;
            } catch (e) {
                res.status(403).send({
                    success: false,
                    message: "Bad token provided."
                });
                throw e;
            }
        } else {
            res.status(403).send({
                success: false,
                message: "No token provided."
            });

            throw "No token provided";
        }
    }

    async login(email, password) {
        const userId = await this.authController.getIDByEmail(email);
        console.log(userId);

        if (userId === -1) {
            //  Email is not registered in database
            return false;
        }

        const passwordHash = await this.authController.getPasswordHash(userId);

        const match = await this.bcrypt.compare(password, passwordHash);

        console.log(match);

        if (match) {
            //  Password matches entry in database -> issue a token
            const jwt = await this.tokenIssuer.issue(userId);
            console.log(jwt);
            return jwt;
        }

        //  Password doesn't match
        return false;
    }

    async hash(password) {
        try {
            return await this.bcrypt.hash(password, this.saltRounds);
        } catch (e) {
            throw e
        }
    }
}

module.exports = Auth;
