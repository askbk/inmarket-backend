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
                message: 'Missing credentials'
            });

            return;
        }

        const authenticated = await this.auth.login(email, password);

        if (authenticated) {
            res.status(200).send({
                success: true,
                jwt: authenticated.jwt,
                userType: authenticated.userType
            });

            return true;
        }

        res.status(403).send({
            success: false,
            message: 'Incorrect credentials'
        });

        return false;
    }

  }

module.exports = LoginAPI;
