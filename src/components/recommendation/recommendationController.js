const vector = require('../math/vector.js');

class Recommend {
    constructor(models) {
        this.jobseekerModel = models.Jobseeker;
        this.employeeModel = models.Employee;
        this.userModel = models.User;
        this.companyModel = models.Company;

        this.contactRequestModel = models.ContactRequest;

        this.skillModel = models.Skill;
        this.interestModel = models.Interest;

        this.jobseekerSkillModel = models.JobseekerSkill;
        this.employeeSkillModel = models.EmployeeSkill;

        this.jobseekerInterestModel = models.JobseekerInterest;
        this.employeeInterestModel = models.JobseekerInterest;

        this.idf = {
            employees: {
                skills: [],
                interests: []
            },
            jobseekers: {
                skills: [],
                interests: []
            }
        };

        this.skills = [];
        this.interests = [];
        this.employees = [];
        this.jobseekers = [];

        this.myVector = { skills: [], interests: [] };

        this.employeeVectorMap = this.employeeVectorMap.bind(this);
        this.jobseekerVectorMap = this.jobseekerVectorMap.bind(this);
    }

    // TODO: clean up code.
    // TODO: Reduce database load by implementing caching for stuff like IDF, skills, etc.

    // This method assumes the user requesting recommendations is a jobseeker
    async employeeRecommendations(context) {
        const userId = context.userId;
        const jobseeker = await this.jobseekerModel.findOne({
            where: { userId: userId },
            attributes: ['id'],
            raw: true
        });

        if (!jobseeker) {
            throw `UserId ${userId} doesn't belong to any jobseeker.`;
        }

        const jobseekerId = jobseeker.id;
        let mySkills, myInterests;

        // Use Promise.all to perform tasks in parallel
        await Promise.all([
            // List of skills for current user (query)
            (async () => {
                mySkills = await this.getMyJobseekerSkills(jobseekerId);
            })(),
            (async () => {
                myInterests = await this.getMyJobseekerInterests(jobseekerId);
            })()
        ]);

        const recommendationContext = {
            userId: userId,
            id: jobseekerId,
            mySkills: mySkills,
            myInterests: myInterests,
            userType: 'jobseeker',
            mapFunction: this.employeeVectorMap
        };

        return await this.getRecommendations(recommendationContext);
    }

    // Same as above, but assume the requesting user is an employee
    async jobseekerRecommendations(context) {
        const userId = context.userId;
        const employee = await this.employeeModel.findOne({
            where: { userId: userId },
            attributes: ['id'],
            raw: true
        });

        if (!employee) {
            throw `UserId ${userId} doesn't belong to any employee.`;
        }

        const employeeId = employee.id;
        let mySkills, myInterests;

        // Use Promise.all to perform tasks in parallel
        await Promise.all([
            // List of skills for current user (query)
            (async () => {
                mySkills = await this.getMyEmployeeSkills(employeeId);
            })(),
            (async () => {
                myInterests = await this.getMyEmployeeInterests(employeeId);
            })()
        ]);

        const recommendationContext = {
            userId: userId,
            id: employeeId,
            mySkills: mySkills,
            myInterests: myInterests,
            userType: 'employee',
            mapFunction: this.jobseekerVectorMap
        };

        return await this.getRecommendations(recommendationContext);
    }

    async getRecommendations(context) {
        const {
            mySkills,
            myInterests,
            mapFunction,
            userType,
            userId,
            id
        } = context;

        let myContacts;

        // Use Promise.all to perform tasks in parallel
        await Promise.all([
            // Get all employees and jobseekers
            (async () => {
                this.employees = await this.getEmployees();
            })(),
            (async () => {
                this.jobseekers = await this.getJobseekers();
            })(),
            // Get all skills (terms)
            (async () => {
                this.skills = await this.getSkills();
            })(),
            // Get all interests (terms)
            (async () => {
                this.interests = await this.getInterests();
            })(),
            // Get all contacts/contact requests for current user
            (async () => {
                myContacts = await this.getContactIds(userId);
            })()
        ]);

        const audience =
            userType === 'jobseeker' ? this.employees : this.jobseekers;

        // Create lookup table for idf
        this.idf = await this.calculateIDF();

        // Calculate tfidf vector of query
        this.myVectors = { skills: [], interests: [] };
        const myIdf =
            userType === 'jobseeker' ? this.idf.jobseekers : this.idf.employees;

        mySkills.forEach(mySkill => {
            this.myVector.skills[mySkill.id] =
                (1 / mySkills.length) * myIdf.skills[mySkill.id];
        });

        myInterests.forEach(myInterest => {
            this.myVector.interests[myInterest.id] =
                (1 / myInterests.length) * myIdf.interests[myInterest.id];
        });

        const idf =
            userType === 'jobseeker' ? this.idf.employees : this.idf.jobseekers;
        // Calculate tfidf vector for every user
        const userVectors = await this.calculateTFIDFVectors(
            audience,
            myContacts,
            idf
        );

        // Calculate cosine of angle between query and each user (cosine similarity)
        const users = userVectors
            .map(mapFunction)
            // Sort users according to cosine similarity in descending order
            .sort(this.cosineSort);

        // Return employees in recommended order
        return users;
        // For easier testing of recommendations
        // const mySkillList = mySkills.map(skill => {return skill.id;});
        // return {myskills: mySkillList, users: users};
    }

    // Calculate inverse document frequency for each skill and interest
    calculateIDF() {
        return new Promise((resolve, reject) => {
            const employeeCount = this.employees.length,
                jobseekerCount = this.jobseekers.length;

            const idf = {
                employees: {
                    skills: [],
                    interests: []
                },
                jobseekers: {
                    skills: [],
                    interests: []
                }
            };

            this.skills.forEach(skill => {
                const employeeFreq = skill.employees.length,
                    jobseekerFreq = skill.jobseekers.length;
                idf.employees.skills[skill.id] =
                    1 + Math.log(employeeCount / (1 + employeeFreq));
                idf.jobseekers.skills[skill.id] =
                    1 + Math.log(jobseekerCount / (1 + jobseekerFreq));
            });

            this.interests.forEach(interest => {
                const employeeFreq = interest.employees.length,
                    jobseekerFreq = interest.jobseekers.length;
                idf.employees.interests[interest.id] =
                    1 + Math.log(employeeCount / (1 + employeeFreq));
                idf.jobseekers.interests[interest.id] =
                    1 + Math.log(jobseekerCount / (1 + jobseekerFreq));
            });

            resolve(idf);
        });
    }

    // Calculate vectors for each employee that isn't already a contact and
    // who hasn't already received a contact request from the current user.
    calculateTFIDFVectors(users, myContacts, idf) {
        return new Promise((resolve, reject) => {
            const vectors = users
                .filter(user => {
                    // Filter out contacts and recipients of contact requests
                    return !myContacts.includes(user.user.id);
                })
                .map(user => {
                    const userVector = { skills: [], interests: [] };

                    user.skills.forEach(skill => {
                        // Only care about skills in query
                        if (this.myVector.skills[skill.id]) {
                            userVector.skills[skill.id] =
                                (1 / user.skills.length) * idf.skills[skill.id];
                        }
                    });

                    user.interests.forEach(interest => {
                        // Only care about skills in query
                        if (this.myVector.interests[interest.id]) {
                            userVector.interests[interest.id] =
                                (1 / user.interests.length) *
                                idf.interests[interest.id];
                        }
                    });

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
        const skillCos = vector.cosine(
            employeeVector.vector.skills,
            this.myVector.skills
        );
        const interestCos = vector.cosine(
            employeeVector.vector.interests,
            this.myVector.interests
        );

        const {
            id,
            company,
            user,
            skills,
            interests,
            role
        } = employeeVector.user;

        return {
            employeeId: id,
            role: role,
            ...company.get(),
            skills: skills,
            interests: interests,
            ...user.get(),
            cosine: (skillCos + interestCos) / 2
        };
    }

    jobseekerVectorMap(jobseekerVector) {
        const skillCos = vector.cosine(
            jobseekerVector.vector.skills,
            this.myVector.skills
        );
        const interestCos = vector.cosine(
            jobseekerVector.vector.interests,
            this.myVector.interests
        );

        const {
            id,
            education,
            user,
            skills,
            interests,
            type
        } = jobseekerVector.user;

        return {
            jobseekerId: id,
            type: type,
            education: education,
            skills: skills,
            interests: interests,
            ...user.get(),
            cosine: (skillCos + interestCos) / 2
        };
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
                    required: false
                }
            ]
        });
    }

    // Get all interests in database, including employees and jobseekers that have
    // each interest.
    async getInterests() {
        return await this.interestModel.findAll({
            include: [
                {
                    model: this.employeeModel,
                    required: false
                },
                {
                    model: this.jobseekerModel,
                    required: false
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
                    where: { id: id }
                }
            ]
        });
    }

    // Get skills of current user (assumes it is an employee)
    async getMyEmployeeSkills(id) {
        return await this.skillModel.findAll({
            include: [
                {
                    model: this.employeeModel,
                    where: { id: id }
                }
            ]
        });
    }

    // Get interests of current user (assumes it is a jobseeker)
    async getMyJobseekerInterests(id) {
        return await this.interestModel.findAll({
            include: [
                {
                    model: this.jobseekerModel,
                    where: { id: id }
                }
            ]
        });
    }

    // Get interests of current user (assumes it is an employee)
    async getMyEmployeeInterests(id) {
        return await this.interestModel.findAll({
            include: [
                {
                    model: this.employeeModel,
                    where: { id: id }
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
                    required: false
                },
                {
                    model: this.interestModel,
                    required: false
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
                    required: false
                },
                {
                    model: this.interestModel,
                    required: false
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
        const user = await this.userModel.findByPk(userId);
        const contacts = await user.getContacts({
            attributes: ['id'],
            raw: true
        });

        return contacts.map(contact => {
            return contact.contacteeId;
        });
    }
}

module.exports = Recommend;
