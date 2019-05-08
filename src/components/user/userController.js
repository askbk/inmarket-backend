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
        console.log(this.jobseekerSkillModel);
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

    async createContact(senderId, reciverId){
        await this.contactModel.create({userId: senderId, contactId:reciverId});
    }

    async hasContactOnOneSide(senderId, reciverId){
        const count = await this.contactModel.count(
            {where:{userId: senderId, contactId:reciverId}});

        if (count > 0)
            return true;

        return false;
    }


    async hasEstablishedContact(id1, id2){
        if(!(await hasContactOnOneSide(id1,id2)))
            return false;
        if(!(await hascontactOnOneSide(id2,id1)))
            return false;
        return true;

        const hasContact1 = await hasContactOnOneSide(id1,id2);
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
                });
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
}

module.exports = UserController;
