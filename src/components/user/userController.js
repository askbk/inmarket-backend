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

        return await user.getContactRequests({
            include: [
                { model: this.employeeModel },
                { model: this.jobseekerModel }
            ]
        });
    }

    async getContacts(userId) {
        const user = await this.userModel.findByPk(userId);

        return await user.getContacts({
            include: [
                { model: this.employeeModel },
                { model: this.jobseekerModel }
            ]
        });
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

    async create(userContext) {
        try {
            const user = this.userModel.build(
                {
                    ...userContext
                },
                {
                    include: [
                        {
                            association: this.userModel.Login,
                            model: this.loginModel
                        },
                        {
                            association: this.userModel.Employee,
                            model: this.employeeModel
                        },
                        {
                            association: this.userModel.Jobseeker,
                            model: this.jobseekerModel
                        },
                        {
                            association: this.userModel.Company,
                            model: this.companyModel
                        }
                    ]
                }
            );

            await user.save();

            if (userContext.userType === "employee") {
                const employee = await user.getEmployee();
                await employee.addSkills(userContext.skills);
                await employee.addInterests(userContext.interests)
            } else if (userContext.userType === "jobseeker") {
                const jobseeker = await user.getJobseeker();
                await jobseeker.addSkills(userContext.skills);
                await jobseeker.addInterests(userContext.interests)
            }

            return true;
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
