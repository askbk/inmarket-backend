class UserController {
    constructor(models) {
        this.userModel = models.User;
        this.jobseekerModel = models.Jobseeker;
        this.employeeModel = models.Employee;
        this.companyModel = models.Company;
        this.loginModel = models.Login;
        this.jobseekerSkillModel = models.JobseekerSkill;
        this.skillModel = models.Skill;
        this.contactModel = models.Contact;
    }

    async getAll() {
        return this.userModel.findAll().then(users => {
            return users;
        });
    }

    async getByID(id) {
        return this.userModel.findByPk(id).then(user => {
            return user;
        });
    }

    async createContact(senderId, receiverId) {
        if (senderId === receiverId) {
            throw "Error when creating contact: Cant't contact yourself.";
        }

        try {
            await this.contactModel.create({
                contacter: senderId,
                contactee: receiverId
            });

            return true;
        } catch (e) {
            res.status(500).send({
                success: false,
                message: `Error when creating contact: ${e}. You probably have already sent a contact request to this user.`
            });

            return false;
        }
    }

    async hasContactOnOneSide(senderId, receiverId) {
        const count = await this.contactModel.count({
            where: { userId: senderId, contactId: receiverId }
        });

        if (count > 0) return true;

        return false;
    }

    async hasEstablishedContact(id1, id2) {
        if (!(await hasContactOnOneSide(id1, id2))) return false;
        if (!(await hascontactOnOneSide(id2, id1))) return false;

        return true;
    }

    async create(userContext, passwordHash) {
        try {
            const user = await this.userModel.create({
                ...userContext
            });

            if (userContext.userType === 'company') {
                this.companyModel.create({
                    ...userContext,
                    userId: user.id
                });
            } else if (userContext.userType === 'employee') {
                this.employeeModel.create({
                    ...userContext,
                    userId: user.id
                });
            } else if (userContext.userType === 'jobseeker') {
                this.jobseekerModel
                    .create({
                        ...userContext,
                        userId: user.id
                    })
                    .then(jobseeker => {
                        const jobseekerSkills = userContext.skills.map(
                            skill => {
                                return {
                                    jobseekerId: jobseeker.id,
                                    skillId: skill,
                                    isActive: true
                                };
                            }
                        );
                        this.jobseekerSkillModel.bulkCreate(jobseekerSkills);
                    });
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
            const success = await user.update({
                firstName,
                lastName,
                description
            });

            return success;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = UserController;
