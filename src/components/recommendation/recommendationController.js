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

        this.idf = {};
        this.skills = [];
        this.employees = [];
        this.jobseekers = [];

        this.employeeVectorMap = this.employeeVectorMap.bind(this);
        this.jobseekerVectorMap = this.jobseekerVectorMap.bind(this);
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
            (async () => {this.skills = await this.getSkills();})(),
            // Get all contacts/contact requests for current user
            (async () => {myContacts = await this.getContactIds(userId);})(),
            // List of skills for current user (query)
            (async () => {
                mySkills = await this.getMyJobseekerSkills(userId);
            })()
        ]);


        return await this.getRecommendations(mySkills, myContacts, this.employees, this.employeeVectorMap);
    }

    // Same as above, but assume the requesting user is an employee
    async jobseekerRecommendations(context) {
        const userId = context.userId;
        let mySkills, myContacts;

        // Use Promise.all to perform tasks in parallel
        await Promise.all([
            // Get all employees (documents)
            (async () => {this.jobseekers = await this.getJobseekers();})(),
            // Get all skills (terms)
            (async () => {this.skills = await this.getSkills();})(),
            // Get all contacts/contact requests for current user
            (async () => {myContacts = await this.getContactIds(userId);})(),
            // List of skills for current user (query)
            (async () => {
                mySkills = await this.getMyEmployeeSkills(userId);
            })()
        ]);

        return await this.getRecommendations(mySkills, myContacts, this.jobseekers, this.jobseekerVectorMap);
    }

    async getRecommendations(mySkills, myContacts, audience, mapFunction, userType) {
        // Create lookup table for idf
        this.idf = await this.calculateIDF();
        console.log(this.idf);

        // Calculate tfidf vector of query
        this.myVector = [];
        const myIdf = userType === "jobseeker" ? this.idf.jobseeker : this.idf.employee;
        for (const mySkill of mySkills) {
            this.myVector[mySkill.id] = (1 / mySkills.length) * myIdf[mySkill.id];
        }

        const idf = userType === "jobseeker" ? this.idf.employee : this.idf.jobseeker;
        // Calculate tfidf vector for every user
        const userVectors = await this.calculateTFIDFVectors(audience, myContacts, idf);

        // Calculate cosine of angle between query and each user (cosine similarity)
        const users = userVectors
            .map(mapFunction)
            // Sort users according to cosine similarity in descending order
            .sort(this.cosineSort);

        // Return employees in recommended order
        return users;
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

    // Get skills of current user (assumes it is a jobseeker)
    async getMyJobseekerSkills(id) {
        return await this.skillModel.findAll({
            include: [
                {
                    model: this.jobseekerModel,
                    where: {id: id}
                }
            ]
        });
    }

    // Get skills of current user (assumes it is a jobseeker)
    async getMyEmployeeSkills(id) {
        return await this.skillModel.findAll({
            include: [
                {
                    model: this.employeeModel,
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

    // Get all jobseekers
    async getJobseekers() {
        return await this.jobseekerModel.findAll({
            include: [
                {
                    model: this.skillModel,
                    required: true
                },
                {
                    model: this.userModel,
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

    // Calculate inverse document frequency for each skill
    calculateIDF() {
        return new Promise((resolve, reject) => {
            const employeeCount = this.employees.length,
                jobseekerCount = this.jobseekers.length;
            const idf = {employee: [], jobseeker: []};
            for (const skill of this.skills) {
                const employeeFreq = skill.employees.length,
                    jobseekerFreq = skill.jobseekers.length;
                idf.employee[skill.id] =
                    1 + Math.log(employeeCount / (1 + employeeFreq));
                idf.jobseeker[skill.id] =
                    1 + Math.log(jobseekerCount / (1 + jobseekerFreq));
            }

            resolve(idf);
        });
    }

    // Calculate vectors for each employee that isn't already a contact and
    // who hasn't already received a contact request from the current user.
    calculateTFIDFVectors(users, myContacts, idf) {
        return new Promise((resolve, reject) => {
            const vectors = users.filter(user => {
                return !myContacts.includes(user.user.id);
            }).map(user => {
                const userVector = [];

                for (const skill of user.skills) {
                    // Only care about skills in query
                    if (this.myVector[skill.id]) {
                        userVector[skill.id] =
                            (1/user.skills.length) * idf[skill.id];
                    }
                }

                return {
                    user: user,
                    vector: userVector
                };
            });

            resolve(vectors);
        });
    }

    // Method for sorting array by cosine value
    cosineSort(a, b) {
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
    }

    employeeVectorMap(employeeVector) {
        const cos = vector.cosine(employeeVector.vector, this.myVector);
        // For easier readability when testing recommendations
        // const skillList = employeeVector.employee.skills.map(skill => {return skill.id;}) || [];
        // return {
        //     employeeId: employeeVector.employee.id,
        //     skills: skillList,
        //     cosine: cos
        // }
        const {id, company, user, skills, role} = employeeVector.user;
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
    }

    jobseekerVectorMap(jobseekerVector) {
        const cos = vector.cosine(jobseekerVector.vector, this.myVector);
        // For easier readability when testing recommendations
        // const skillList = employeeVector.employee.skills.map(skill => {return skill.id;}) || [];
        // return {
        //     employeeId: employeeVector.employee.id,
        //     skills: skillList,
        //     cosine: cos
        // }
        const {id, education, user, skills, type} = jobseekerVector.user;
        return {
            jobseeker: {
                jobseekerId: id,
                type: type,
                education: education,
                skills: skills,
                ...user.get()
            },
            cosine: cos
        };
    }
}

module.exports = Recommend;
