class AuthDAL {
    constructor(models) {
        this.loginModel = models.Login;
    }

    async getIDByEmail(email) {
        try {
            const login = await this.loginModel.findOne(
                {
                    attributes: ["userId"],
                    where: {
                        email: email
                    }
                }
            );

            return login.userId;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getPasswordHash(id) {
        try {
            const login = await this.loginModel.findOne(
                {
                    where: {
                        userId: id
                    }
                }
            );

            return login.passwordHash;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

module.exports = AuthDAL;
