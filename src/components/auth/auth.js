const TokenIssuer   = require('./token.js');

class Auth {
    constructor(authDAL, models) {
        this.tokenIssuer = new TokenIssuer();
        this.userModel = models.User;
        this.authDAL = authDAL;
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

                return decoded;
            } catch (e) {
                res.status(401).send({
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
        const userId = await this.authDAL.getIDByEmail(email);
        console.log(userId);

        if (!userId) {
            //  Email is not registered in database
            //  Should find a better way to handle this.
            return false;
        }

        const passwordHash = await this.authDAL.getPasswordHash(userId);

        const match = await this.bcrypt.compare(password, passwordHash);

        console.log(match);

        if (match) {
            //  Password matches entry in database -> issue a token
            const user = await this.userModel.findByPk(userId);

            const fullName = `${user.lastName} ${user.firstName}`;
            const isAdmin = user.isAdmin;
            const userContext = { userId, fullName, isAdmin };

            const jwt = await this.tokenIssuer.issue(userContext);

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
