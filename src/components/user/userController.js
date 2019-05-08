class UserController {
    constructor(models, recommend) {
        this.userModel = models.User;
        this.jobseekerModel = models.Jobseeker;
        this.employeeModel = models.Employee;
        this.companyModel = models.Company;
        this.loginModel = models.Login;
        this.jobseekerSkillModel = models.JobseekerSkill;
        this.employeeSkillModel = models.EmployeeSkill;
        this.skillModel = models.Skill;
        this.recommend = recommend;
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
            } else if (userContext.userType === "employee") {
                this.employeeModel.create({
                    ...userContext,
                    userId: user.id,
                }).then(employee => {
                    const employeeSkills = userContext.skills.map(skill => {
                        return {
                            employeeId: employee.id,
                            skillId: skill,
                            isActive: true
                        }
                    });
                    this.employeeSkillModel.bulkCreate(employeeSkills);
                })
            } else if (userContext.userType === "jobseeker") {

                this.jobseekerModel.create({
                    ...userContext,
                    userId: user.id
                }).then(jobseeker => {
                    const jobseekerSkills = userContext.skills.map(skill => {
                        return {
                            jobseekerId: jobseeker.id,
                            skillId: skill,
                            isActive: true
                        }
                    });
                    this.jobseekerSkillModel.bulkCreate(jobseekerSkills);
                })
            }

            // TODO: need to insert skills that jobseeker has or that employee
            // wants

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

    async getContactRecommendations(context) {
        console.log(this.recommend);
        return this.recommend.meEmployees(context);
    }
}

module.exports = UserController;
