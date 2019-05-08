const vector = require("../math/vector.js");

class Recommend {
    constructor(models) {
        this.jobseekerModel = models.Jobseeker;
        this.employeeModel = models.Employee;
        this.jobseekerSkillModel = models.JobseekerSkill;
        this.employeeSkillModel = models.EmployeeSkill;
        this.skillModel = models.Skill;

        this.idf = [];
        this.skills = [];
        this.employees = [];
        this.employeeCount = 0;
    }

    // TODO: clean up code.
    // TODO: add same calculation for interests.
    // TODO: Reduce database load by implementing caching for stuff like IDF, skills, etc.
    async meEmployees(context) {
        const userId = context.userId,
            userType = context.userType;

        const targetType = userType === "jobseeker" ? "employee" : "jobseeker";


        if (userType === "jobseeker") {
            let mySkills;

            // Use Promise.all to perform tasks in parallel
            await Promise.all([
                // Get all employees (documents)
                this.getEmployees(),
                // Get all skills (terms)
                // Is it better to just use this.employees, as it already contains
                // relevant skills? Would then have to manually count number of
                // employees looking for a specific skill. Check if there is some
                // performance to be gained here.
                this.getSkills(),
                // List of skills for current user (query)
                (async () => {mySkills = await this.getMySkills(userId);})(),
            ]);

            // Create lookup table for idf
            await this.calculateIDF();

            // Count skills (query length)
            const mySkillCount = mySkills.length;

            // Calculate tfidf vector of query
            const myVector = [];
            for (const mySkill of mySkills) {
                myVector[mySkill.id] = (1 / mySkills.length) * this.idf[mySkill.id];
            }

            // Calculate tfidf vector for every employee
            const employeeVectors = await this.calculateTFIDFVectors(myVector);

            // Calculate cosine of angle between query and each employee
            const employees = await Promise.all(employeeVectors.map(async employee => {
                const cos = await vector.cosine(employee.vector, myVector);
                return {
                    employee: employee.employee,
                    cosine: cos
                }
            })
            // Sort employees according to cosine similarity
            .sort((firstEl, secondEl) => {
                if (firstEl.cosine > secondEl.cosine) {
                    return -1;
                }

                if (secondEl.cosine > firstEl.cosine) {
                    return 1;
                }

                return 0;
            }));

            // Return employees in recommended order
            return employees;
        } else if (userType === "employee") {
            const jobseekerCount = await this.jobseeker.count();
            // do the same here
        }
    }

    async getSkills() {
        this.skills = await this.skillModel.findAll({
            include: [{
                model: this.employeeModel,
                required: false
            },
            {
                model: this.jobseekerModel,
                required: true
            }]
        });
    }

    async getMySkills(id) {
        return await this.skillModel.findAll({
            include: [{
                model: this.jobseekerModel,
                where: {id: 1}
            }]
        });
    }

    async getEmployees() {
        this.employees = await this.employeeModel.findAll({
            include: [{
                model: this.skillModel,
                required: true
            }]
        });
    }

    async getJobseekers() {
        this.jobseekers = await this.jobseekerModel.findAll({
            include: [{
                model: this.skillModel,
                required: true
            }]
        });
    }

    calculateIDF() {
        return new Promise((resolve, reject) => {
            const employeeCount = this.employees.length;
            for (const skill of this.skills) {
                const docFreq = skill.employees.length;
                this.idf[skill.id] = 1 + Math.log(employeeCount / (1 + docFreq));
            }

            resolve(true);
        });
    }

    calculateTFIDFVectors(queryVector) {
        return new Promise((resolve, reject) => {
            const vectors = this.employees.map(employee => {
                const employeeVector = [];

                for (const skill of employee.skills) {
                    // Only care about skills (terms) in jobseeker (query)
                    if (queryVector[skill.id]) {
                        employeeVector[skill.id] = (1 / employee.skills.length) * this.idf[skill.id];
                    }
                }

                return {
                    employee: employee,
                    vector: employeeVector
                }
            });

            resolve(vectors);
        });
    }
}

module.exports = Recommend;
