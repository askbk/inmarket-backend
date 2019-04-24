const TokenIssuer   = require('./token.js');
const UserDAL       = require("../user/userDAL.js");

class Auth {
    constructor(models) {
        this.tokenIssuer = new TokenIssuer();
        this.users = new UserDAL(models.User);
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
        }
    }

    async login(email, password) {
        const userId = await this.users.getIDByEmail(email);

        if (userId === -1) {
            //  Email is not registered in database
            return false;
        }

        if (await this.bcrypt.compare(password, await users.getPassword(userId))) {
            //  Password matches entry in database -> issue a token
            const jwt = await this.token.issue(userId);
            return jwt;
        }
        //  Password doesn't match
        return false;
    }
}

module.exports = Auth;
