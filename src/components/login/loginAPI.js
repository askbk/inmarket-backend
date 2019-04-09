class LoginAPI {
    constructor(auth) {
        this.auth = auth;
    }

    async login(req, res, next) {
        const email = req.body.email,
        password = req.body.password;

        //  Email or password undefined
        if (!email || !password) {
            res.status(403).send({
                success: false,
                message: "Missing credentials";
            });

            return;
        }
        
        this.auth.login(email, password);

        res.send(result);
    }
}

module.exports = UserAPI;
