module.exports = class Auth {
    constructor(pool, token, users) {
        this.pool = pool;
        this.token = token;
        this.users = users;
    }

    async authenticate(req, res, next) {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            try {
                this.token.verify(token, (err, decoded) => {
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

        if (email && password) {
            const userId = this.users.getId(email);

            if (userId === -1) {
                res.status(403).send({
                    success: false,
                    message: "Bad email";
                });
                return;
            }

            if (this.verifyPassword(password, users.getPassword(userId))) {
                const jwt = this.token.issue(userId);
                res.status(200).send({
                    success: true,
                    token: jwt;
                });
                next();
                return;
            }

            if (userId === -1) {
                res.status(403).send({
                    success: false,
                    message: "Bad email";
                });
                return;
            }
        }

        res.status(403).send({
            success: false,
            message: "Bad email";
        });

        return;
    }

    async verifyPassword(attempt, truth) {
        //  gotta implement
        return true;
    }
}
