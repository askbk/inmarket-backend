const TokenIssuer = require('./token.js');

module.exports = class Auth {
    constructor(userDAL) {
        this.tokenIssuer = new TokenIssuer();
        this.users = userDAL;
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
                        next();
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
        const userId = this.users.getIDByEmail(email);
        //  Email is not registered in database
        if (userId === -1) {
            return false;
        }

        //  Email and password match entry in database -> issue a token
        if (this.verifyPassword(password, users.getPassword(userId))) {
            const jwt = this.token.issue(userId);
            return jwt;
        }

        return false;
    }

    // TODO: gotta implement.
    async verifyPassword(attempt, truth) {
        //  gotta implement
        return true;
    }
}
