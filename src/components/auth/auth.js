const TokenIssuer = require('./token.js');

module.exports = class Auth {
    constructor(userDAL) {
        this.tokenIssuer = new TokenIssuer;
        this.users = userDAL;
    }

    async authenticate(req, res, next) {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
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

    async login(req, res, next) {
        const email = req.body.email,
            password = req.body.password;

        //  Email or password undefined
        if (!email && !password) {
            res.status(403).send({
                success: false,
                message: "Bad email";
            });

            return;
        }

        const userId = this.users.getId(email);
        //  Email is not registered in database
        if (userId === -1) {
            res.status(403).send({
                success: false,
                message: "Bad email";
            });
            return;
        }

        //  Email and password match entry in database -> issue a token
        if (this.verifyPassword(password, users.getPassword(userId))) {
            const jwt = this.token.issue(userId);
            res.status(200).send({
                success: true,
                token: jwt;
            });
            next();
            return;
        }
    }

    // TODO: gotta implement.
    async verifyPassword(attempt, truth) {
        //  gotta implement
        return true;
    }
}
