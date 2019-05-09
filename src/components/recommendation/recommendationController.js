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

    // This method assumes the user requesting recommendations is a jobseeker
    async employeeRecommendations(context) {
        const userId = context.userId

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
        const employees = employeeVectors.map(employeeVector => {
            const cos = vector.cosine(employeeVector.vector, myVector);
            // For easier readability when testing recommendations
            // const skillList = employeeVector.employee.skills.map(skill => {return skill.id;}) || [];
            // return {
                //     employeeId: employeeVector.employee.id,
                //     skills: skillList,
                //     cosine: cos
                // }
                return {
                    employee: employeeVector.employee,
                    cosine: cos
                }
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

            // Both are bad
            return 0
        });

        // Return employees in recommended order
        return employees;
        // For easier testing of recommendations
        // const mySkillList = mySkills.map(skill => {return skill.id;});
        // return {myskills: mySkillList, employees: employees};
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
                where: {id: id}
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
