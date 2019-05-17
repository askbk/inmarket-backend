class UserController {
    constructor(models) {
        this.userModel = models.User;
        this.loginModel = models.Login;

        this.jobseekerModel = models.Jobseeker;
        this.employeeModel = models.Employee;
        this.companyModel = models.Company;

        this.jobseekerSkillModel = models.JobseekerSkill;
        this.employeeSkillModel = models.EmployeeSkill;
        this.skillModel = models.Skill;
        this.contactModel = models.Contact;
        this.jobseekerInterestModel = models.JobseekerInterest;
        this.employeeInterestModel = models.EmployeeInterest;
        this.interestModel = models.Interest;
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
            throw `Error when creating contact: ${e}. You probably have already sent a contact request to this user.`;

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
                const employee = await this.employeeModel.create({
                    ...userContext,
                    userId: user.id
                });

                const employeeSkills = userContext.skills.map(skill => {
                    return {
                        employeeId: employee.id,
                        skillId: skill,
                        isActive: true
                    };
                });

                this.employeeSkillModel.bulkCreate(employeeSkills);

                const employeeInterests = userContext.interests.map(
                    interest => {
                        return {
                            employeeId: employee.id,
                            interestId: interest,
                            isActive: true
                        };
                    }
                );

                this.employeeInterestModel.bulkCreate(employeeInterests);
            } else if (userContext.userType === 'jobseeker') {
                const jobseeker = await this.jobseekerModel.create({
                    ...userContext,
                    userId: user.id
                });

                const jobseekerSkills = userContext.skills.map(skill => {
                    return {
                        jobseekerId: jobseeker.id,
                        skillId: skill,
                        isActive: true
                    };
                });

                this.jobseekerSkillModel.bulkCreate(jobseekerSkills);

                const jobseekerInterests = userContext.interests.map(
                    interest => {
                        return {
                            jobseekerId: jobseeker.id,
                            interestId: interest,
                            isActive: true
                        };
                    }
                );

                this.jobseekerInterestModel.bulkCreate(jobseekerInterests);
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
