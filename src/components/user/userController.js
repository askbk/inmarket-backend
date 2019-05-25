const Sq = require('sequelize');
const Op = Sq.Op;

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
        this.contactRequestModel = models.ContactRequest;
        this.jobseekerInterestModel = models.JobseekerInterest;
        this.employeeInterestModel = models.EmployeeInterest;
        this.interestModel = models.Interest;
    }

    async getAll(myId) {
        const users = await this.userModel.findAll({
            where: {
                id: {
                    [Op.ne]: myId
                }
            }
        });

        const userConnections = await Promise.all(
            users.map(async user => {
                const connectionStatus = await this.getConnectionStatus(
                    user.id,
                    myId
                );
                return { ...user.get(), connectionStatus };
            })
        );

        return userConnections;
    }

    async getFilteredOnName(filter, myId) {
        const filteredUsers = await this.userModel.findAll({
            where: {
                [Op.and]: [
                    Sq.where(
                        Sq.fn(
                            'concat',
                            Sq.col('firstName'),
                            ' ',
                            Sq.col('lastName')
                        ),
                        { [Op.like]: '%' + filter + '%' }
                    )
                ],
                id: {
                    [Op.ne]: myId
                }
            }
        });

        const userConnections = await Promise.all(
            filteredUsers.map(async user => {
                const connectionStatus = await this.getConnectionStatus(
                    user.id,
                    myId
                );
                return { ...user.get(), connectionStatus };
            })
        );

        return userConnections;
    }

    async getByID(id, myId) {
        // Return all info
        if (id === myId) {
            const user = await this.userModel.findByPk(id, {
                include: [
                    {
                        model: this.employeeModel,
                        include: this.companyModel
                    },
                    this.jobseekerModel,
                    this.companyModel
                ]
            });

            return user;
        }

        // TODO: Restrict some of the info being returned.

        const user = await this.userModel.findByPk(id, {
            include: [
                {
                    model: this.employeeModel,
                    include: this.companyModel
                },
                {
                    model: this.jobseekerModel
                },
                this.companyModel
            ]
        });
        const connectionStatus = await this.getConnectionStatus(myId, id);
        const userValues = user.get();

        return { ...userValues, connectionStatus };
    }

    // Create contact between two users (accept request from contacter)
    async createContact(contacterId, contacteeId) {
        if (contacterId === contacteeId) {
            throw "Cant't contact yourself.";
        }

        await this.contactRequestModel.destroy({
            where: {
                contacteeId
            }
        });

        try {
            const contactee = await this.userModel.findByPk(contacteeId);
            const contacter = await this.userModel.findByPk(contacterId);

            contactee.addContact(contacter);
            contacter.addContact(contactee);

            return true;
        } catch (e) {
            throw e;

            return false;
        }
    }

    // Send contact request to contactee
    async createContactRequest(contacterId, contacteeId) {
        if (contacterId === contacteeId) {
            throw "Cant't contact yourself.";
        }

        try {
            await this.contactRequestModel.create({
                contacterId,
                contacteeId
            });

            return true;
        } catch (e) {
            throw e;

            return false;
        }
    }

    // Decline contact request from contacter
    async declineRequest(contacterId, contacteeId) {
        if (contacterId === contacteeId) {
            throw `Sender and receiver are the same (userId=${contacterId}).`;
        }

        try {
            await this.contactRequestModel.update(
                {
                    isDeclined: true
                },
                {
                    where: {
                        [Op.and]: {
                            contacterId,
                            contacteeId
                        }
                    }
                }
            );

            return true;
        } catch (e) {
            throw e;

            return false;
        }
    }

    // Get all received contact requests
    async getContactRequests(userId) {
        const user = await this.userModel.findByPk(userId);

        const contactRequests = await user.getContactRequests({
            include: [
                { model: this.employeeModel },
                { model: this.jobseekerModel }
            ]
        });

        return contactRequests.filter(user => {
            return !user.contactRequest.isDeclined;
        }).map(user => {
            return {...user.get(), connectionStatus: "requestReceived"}
        })
    }

    async getContacts(userId) {
        const user = await this.userModel.findByPk(userId);

        const contacts = await user.getContacts({
            include: [
                { model: this.employeeModel },
                { model: this.jobseekerModel }
            ]
        });

        return contacts.map(user => {
            return {...user.get(), connectionStatus: "contact"}
        })
    }

    async getConnectionStatus(myId, id) {
        const user = await this.userModel.findByPk(id);

        let connectionStatus = 'noContact';

        const contacts = await user.getContacts();

        for (const contact of contacts) {
            if (contact.id == myId) {
                connectionStatus = 'contact';
                break;
            }
        }

        if (connectionStatus === 'noContact') {
            const requestSent = await this.contactRequestModel.findOne({
                where: { contacterId: myId, contacteeId: id }
            });

            if (requestSent) {
                connectionStatus = 'requestSent';
            } else {
                const requestReceived = await this.contactRequestModel.findOne({
                    where: {
                        contacterId: id,
                        contacteeId: myId
                    }
                });
                if (requestReceived) {
                    connectionStatus = 'requestReceived';
                }
            }
        }

        return connectionStatus;
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
