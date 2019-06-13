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

    async updateCredentials(req, res, next){
        //  Authenticate user and decode token
        const password = req.body.password;

        let token;
        try {
            token = await this.auth.authenticate(req, res, next);
            if (!token) {
                res.status(401).send({
                    success: false,
                    message: 'Not logged in with a valid token'
                });
                return false;
            }
        } catch (e) {
            return false;
        }
        const userId = token.sub;
        const match = this.auth.loginById(userId, password);

        if(match){

        }else {
            //Wrong password
        }
      }

  }

module.exports = LoginAPI;
