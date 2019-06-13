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
            },
            include: [this.jobseekerModel, this.employeeModel]
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
                        model: this.employeeModel
                    },
                    {
                        model: this.jobseekerModel
                    }
                ]
            });

            const skills =
                user.userType === 'employee'
                    ? await user.employee.getSkills()
                    : await user.jobseeker.getSkills();

            const interests =
                user.userType === 'employee'
                    ? await user.employee.getInterests()
                    : await user.jobseeker.getInterests();

            return { ...user.get(), skills };
        }

        // TODO: Restrict some of the info being returned.

        const user = await this.userModel.findByPk(id, {
            include: [
                {
                    model: this.employeeModel
                },
                {
                    model: this.jobseekerModel
                }
            ]
        });

        const skills =
            user.userType === 'employee'
                ? await user.employee.getSkills()
                : await user.jobseeker.getSkills();

        const interests =
            user.userType === 'employee'
                ? await user.employee.getInterests()
                : await user.jobseeker.getInterests();

        const connectionStatus = await this.getConnectionStatus(id, myId);
        const userValues = user.get();

        return { ...userValues, connectionStatus, skills, interests };
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

        return contactRequests
            .filter(user => {
                return !user.contactRequest.isDeclined;
            })
            .map(user => {
                return { ...user.get(), connectionStatus: 'requestReceived' };
            });
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
            return { ...user.get(), connectionStatus: 'contact' };
        });
    }

    async getConnectionStatus(id, myId) {
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
            const requestSent = await this.contactRequestModel.count({
                where: { contacterId: myId, contacteeId: id }
            });

            if (requestSent) {
                connectionStatus = 'requestSent';
            } else {
                const requestReceived = await this.contactRequestModel.count({
                    where: {
                        contacterId: id,
                        contacteeId: myId
                    }
                });
                if (requestReceived > 0) {
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
                        }
                    ]
                }
            );

            await user.save();

            if (userContext.userType === 'employee') {
                const employee = await user.getEmployee();
                await employee.addSkills(userContext.skills);
                await employee.addInterests(userContext.interests);
            } else if (userContext.userType === 'jobseeker') {
                const jobseeker = await user.getJobseeker();
                await jobseeker.addSkills(userContext.skills);
                await jobseeker.addInterests(userContext.interests);
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

    async updateCredentials(userContext){
        const user = await this.loginModel.findByPk(userContext.id);
        const { newEmail, newPassword } = userContext;

        console.log("EYEY");
    }
}

module.exports = UserController;
