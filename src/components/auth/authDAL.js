class AuthDAL {
    constructor(models) {
        this.loginModel = models.Login;
    }

    async getIDByEmail(email) {
        try {
            const id = await this.loginModel.findOne(
                {
                    attributes: ["userId"],
                    where: {
                        email: email
                    }
                }
            );

            return id
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getPasswordHash(id) {
        try {
            const passwordHash = await this.loginModel.findOne(
                {
                    attributes: ["passwordHash"],
                    where: {
                        id: id
                    }
                }
            );

            return passwordHash
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

module.exports = AuthDAL;
