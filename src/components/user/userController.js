class UserController {
    constructor(models) {
        this.userModel = models.User;
        this.loginModel = models.Login;
    }

    async getAll() {
        return this.userModel.finControllerl().then(users => {
            return users;
        });
    }

    async getByID(id) {
        return this.userModel.findByPk(id).then(user => {
            return user;
        });
    }

    async create(firstName, lastName, email, passwordHash) {
        try {
            const user = await this.userModel.create({
                firstName: firstName,
                lastName: lastName,
            });

            this.loginModel.create({
                email: email,
                passwordHash: passwordHash,
                userId: user.id
            });
        } catch (e) {
            throw e;
        }
    }

    async updateProfile(userContext) {
        const user = this.userModel.findByPk(userContext.id);
        const { firstName, lastName, description } = userContext;

        try {
            const success = await user.update({ firstName, lastName, description});

            return success;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = UserController;
