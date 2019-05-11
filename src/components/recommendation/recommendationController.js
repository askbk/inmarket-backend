const vector = require("../math/vector.js");

class Recommend {
    constructor(models) {
        this.jobseekerModel = models.Jobseeker;
        this.employeeModel = models.Employee;
        this.jobseekerSkillModel = models.JobseekerSkill;
        this.employeeSkillModel = models.EmployeeSkill;
        this.skillModel = models.Skill;
        this.userModel = models.User;
        this.companyModel = models.Company;
        this.contactModel = models.Contact;

        this.idf = [];
        this.skills = [];
        this.employees = [];
    }

    // TODO: clean up code.
    // TODO: add same calculation for interests.
    // TODO: Reduce database load by implementing caching for stuff like IDF, skills, etc.
    // TODO: Implement jobseeker recommendations for employees

    // This method assumes the user requesting recommendations is a jobseeker
    async employeeRecommendations(context) {
        const userId = context.userId;

        let mySkills, myContacts;

        // Use Promise.all to perform tasks in parallel
        await Promise.all([
            // Get all employees (documents)
            (async () => {this.employees = await this.getEmployees();})(),
            // Get all skills (terms)
            // Is it better to just use this.employees, as it already contains
            // relevant skills? Would then have to manually count number of
            // employees looking for a specific skill. Check if there is some
            // performance to be gained here.
            (async () => {this.skills = await this.getSkills();})(),
            // Get all contacts/contact requests for current user
            (async () => {myContacts = await this.getContactIds(userId);})(),
            // List of skills for current user (query)
            (async () => {
                mySkills = await this.getMySkills(userId);
            })()
        ]);

        // Create lookup table for idf
        this.idf = await this.calculateIDF();

        // Calculate tfidf vector of query
        const myVector = [];
        for (const mySkill of mySkills) {
            myVector[mySkill.id] = (1 / mySkills.length) * this.idf[mySkill.id];
        }

        // Calculate tfidf vector for every employee
        const employeeVectors = await this.calculateTFIDFVectors(myVector, myContacts);

        // Calculate cosine of angle between query and each employee (cosine similarity)
        const employees = employeeVectors
            .map(employeeVector => {
                const cos = vector.cosine(employeeVector.vector, myVector);
                // For easier readability when testing recommendations
                // const skillList = employeeVector.employee.skills.map(skill => {return skill.id;}) || [];
                // return {
                //     employeeId: employeeVector.employee.id,
                //     skills: skillList,
                //     cosine: cos
                // }
                const {id, company, user, skills, role} = employeeVector.employee;
                return {
                    employee: {
                        employeeId: id,
                        role: role,
                        ...company.get(),
                        skills: skills,
                        ...user.get()
                    },
                    cosine: cos
                };
            })
            // Sort employees according to cosine similarity in descending order
            .sort((a, b) => {
                // Both cosines are well-defined and non-zero
                if (a.cosine && b.cosine) {
                    if (a.cosine > b.cosine) return -1;
                    if (b.cosine > a.cosine) return 1;
                    return 0;
                }

                // Check if first cosine is well-defined
                if (a.cosine) {
                    return -1;
                }

                // check if second cosine is well-defined
                if (b.cosine) {
                    return 1;
                }

                // Both are 0/null/NaN
                return 0;
            });

        // Return employees in recommended order
        return employees;
        // For easier testing of recommendations
        // const mySkillList = mySkills.map(skill => {return skill.id;});
        // return {myskills: mySkillList, employees: employees};
    }

    // Get all skills in database including employees and jobseekers that have
    // each skill.
    async getSkills() {
        return await this.skillModel.findAll({
            include: [
                {
                    model: this.employeeModel,
                    required: false
                },
                {
                    model: this.jobseekerModel,
                    required: true
                }
            ]
        });
    }

    // Get skills of current user
    async getMySkills(id) {
        return await this.skillModel.findAll({
            include: [
                {
                    model: this.jobseekerModel,
                    where: {id: id}
                }
            ]
        });
    }

    // Get all employees
    async getEmployees() {
        return await this.employeeModel.findAll({
            include: [
                {
                    model: this.skillModel,
                    required: true
                },
                {
                    model: this.userModel,
                    required: true
                },
                {
                    model: this.companyModel,
                    required: true
                }
            ]
        });
    }

    // Get userIds of all users that the current user either already has contact
    // with, or that the current user already has sent a contact request to.
    async getContactIds(userId) {
        return await this.contactModel.findAll({
            where: {userId: userId},
            attributes: ['contactId']
        });
    }

    // Get all jobseekers
    async getJobseekers() {
        return await this.jobseekerModel.findAll({
            include: [
                {
                    model: this.skillModel,
                    required: true
                }
            ]
        });
    }

    // Calculate inverse document frequency for each skill
    calculateIDF() {
        return new Promise((resolve, reject) => {
            const employeeCount = this.employees.length;
            const idf = [];
            for (const skill of this.skills) {
                const docFreq = skill.employees.length;
                idf[skill.id] =
                    1 + Math.log(employeeCount / (1 + docFreq));
            }

            resolve(idf);
        });
    }

    // Calculate vectors for each employee that isn't already a contact and
    // who hasn't already received a contact request from the current user.
    calculateTFIDFVectors(queryVector, myContacts) {
        return new Promise((resolve, reject) => {
            const vectors = this.employees.filter(employee => {
                return !myContacts.includes(employee.user.id);
            }).map(employee => {
                const employeeVector = [];

                for (const skill of employee.skills) {
                    // Only care about skills (terms) in jobseeker (query)
                    if (queryVector[skill.id]) {
                        employeeVector[skill.id] =
                            (1 / employee.skills.length) * this.idf[skill.id];
                    }
                }

                return {
                    employee: employee,
                    vector: employeeVector
                };
            });

            resolve(vectors);
        });
    }
}

module.exports = Recommend;
