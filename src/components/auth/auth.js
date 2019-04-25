const TokenIssuer   = require('./token.js');

class Auth {
    constructor(authDAL) {
        this.tokenIssuer = new TokenIssuer();
        this.authDAL = authDAL;
        this.bcrypt = require("bcrypt");
        this.saltRounds = 10;
    }

    async authenticate(req, res, next) {
        const token = req.body.token || req.body.jwt;

        if (token) {
            try {
                this.tokenIssuer.verify(token, (err, decoded) => {
                    if (err) {
                        throw err;
                    }

                    if (decoded) {
                        return true;
                    }
                });
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
        const userId = await this.authDAL.getIDByEmail(email);
        console.log(userId);

        if (userId === -1) {
            //  Email is not registered in database
            return false;
        }

        if (await this.bcrypt.compare(password, await this.authDAL.getPasswordHash(userId))) {
            //  Password matches entry in database -> issue a token
            const jwt = await this.token.issue(userId);
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
