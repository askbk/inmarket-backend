class UserController {
    constructor(models) {
        this.userModel = models.User;
        this.jobseekerModel = models.Jobseeker;
        this.employeeModel = models.Employee;
        this.companyModel = models.Company;
        this.loginModel = models.Login;
        this.jobseekerSkillModel = models.JobseekerSkill;
        this.employeeSkillModel = models.EmployeeSkill;
        this.skillModel = models.Skill;
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

    // TODO: implement cosine similarity calculation.
    // TODO: clean up code.
    // TODO: add same calculation for interests.
    // TODO: Reduce database load by implementoing caching for stuff like IDF, skills, etc.
    async getContactRecommendations(context) {
        const userId = context.userId,
            userType = context.userType;

        const targetType = userType === "jobseeker" ? "employee" : "jobseeker";


        if (userType === "jobseeker") {
            // Get all employees (documents)
            const employees = await this.employeeModel.findAll({
                include: [{
                    model: this.skillModel,
                    required: true
                }]
            });

            // Count number of employees (documents)
            const employeeCount = employees.length;

            // Get all skills (terms)
            const skills = await this.skillModel.findAll({
                include: [{
                    model: this.employeeModel,
                    required: false
                }]
            });

            // Count number of skills (terms)
            const skillCount = skills.length;

            // Create lookup table for idf
            const idf = [];
            for (const skill of skills) {
                const docFreq = skill.employees.length;
                idf[skill.id] = 1 + Math.log(employeeCount / (1 + docFreq));
            }

            // List of skills for current user (query)
            const mySkills = await this.skillModel.findAll({
                include: [{
                    model: this.jobseekerModel,
                    where: {id: 1}
                }]
            });

            // Count skills (query length)
            const mySkillCount = mySkills.length;

            // Calculate tfidf vector of query
            const myVector = {};
            for (const mySkill of mySkills) {
                myVector[mySkill.id] = (1 / mySkills.length) * idf[mySkill.id];
            }

            // Calculate tfidf vector for every employee
            const employeeVectors = employees.map(employee => {
                const employeeVector = {};

                for (const skill of employee.skills) {
                    // Only care about skills (terms) in jobseeker (query)
                    if (myVector[skill.id]) {
                        employeeVector[skill.id] = (1 / employee.skills.length) * idf[skill.id];
                    }
                }

                return {
                    employeeId: employee.id,
                    vector: employeeVector
                }
            });

            //  Return jobseeker tfidf vector and array of each employee's tfidf vector
            return {
                myVector: myVector,
                employees: employeeVectors
            }
        } else if (userType === "employee") {
            const jobseekerCount = await this.jobseeker.count();
            // do the same here
        }
    }
}

module.exports = UserController;
