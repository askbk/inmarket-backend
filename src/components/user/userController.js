class UserController {
    constructor(models) {
        this.userModel = models.User;
        this.jobseekerModel = models.Jobseeker;
        this.employeeModel = models.Employee;
        this.companyModel = models.Company;
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

    async create(userContext, passwordHash) {
        try {
            const user = await this.userModel.create({
                ...userContext
            });

            if (userContext.userType === "company") {
                this.companyModel.create({
                    ...userContext,
                    userId: user.id
                });
            } else if (userContext.type === "employee") {
                this.employeeModel.create({
                    ...userContext,
                    userId: user.id
                });
            } else if (userContext.type === "jobseeker") {
                this.jobseekerModel.create({
                    ...userContext,
                    userId: user.id
                });
            }

            this.loginModel.create({
                email: userContext.email,
                passwordHash: passwordHash,
                userId: user.id
            });
        } catch (e) {
            throw e;
        }
    }

    async updateProfile(userContext) {
        const user = await this.userModel.findByPk(userContext.id);
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
