const Sq = require('sequelize');
const Models = require('./models');
const sq = new Sq('inmarket_db', 'ask', '123', {
    host: 'database',
    dialect: 'mariadb'
});

sq.authenticate()
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.error('Unable to connect to database:', err);
    });

// const Company = Models.Company(sq, Sq);
const Login = Models.Login(sq, Sq);
const Employee = Models.Employee(sq, Sq);
const Activity = Models.Activity(sq, Sq);
const ActivityException = Models.ActivityException(sq, Sq);
const Jobseeker = Models.Jobseeker(sq, Sq);
const Skill = Models.Skill(sq, Sq);
const SkillRating = Models.SkillRating(sq, Sq);
const JobseekerSkill = Models.JobseekerSkill(sq, Sq);
const EmployeeSkill = Models.EmployeeSkill(sq, Sq);
const Interest = Models.Interest(sq, Sq);
const InterestRating = Models.InterestRating(sq, Sq);
const JobseekerInterest = Models.JobseekerInterest(sq, Sq);
const EmployeeInterest = Models.EmployeeInterest(sq, Sq);
const User = Models.User(sq, Sq);
const Conversation = Models.Conversation(sq, Sq);
const Message = Models.Message(sq, Sq);

const ContactRequest = sq.define('contactRequest', {
    isDeclined: {
        type: Sq.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

User.Contacts = User.belongsToMany(User, {
    as: 'Contacts',
    through: 'contacts',
    otherKey: 'contacterId',
    foreignKey: 'contacteeId'
});

User.ContactRequests = User.belongsToMany(User, {
    as: 'ContactRequests',
    through: ContactRequest,
    otherKey: 'contacterId',
    foreignKey: 'contacteeId'
});

Login.User = Login.belongsTo(User);
User.Login = User.hasOne(Login);
User.Employee = User.hasOne(Employee);
// User.Company = User.hasOne(Company);

Employee.User = Employee.belongsTo(User);
User.Jobseeker = User.hasOne(Jobseeker);
Jobseeker.User = Jobseeker.belongsTo(User);
// Jobseeker.MonitoringCompany = Jobseeker.belongsTo(Company, {
//     as: 'monitoringCompany'
// });
// Company.User = Company.belongsTo(User);
// Company.Employees = Company.hasMany(Employee);
// Employee.Company = Employee.belongsTo(Company);

User.Activities = User.belongsToMany(Activity, {
    through: 'activityParticipant',
    as: 'activities'
});
User.ActivityInvitations = User.belongsToMany(Activity, {
    through: 'activityInvitation',
    as: 'activityInvitations'
});
Activity.InvitedUsers = Activity.belongsToMany(User, {
    through: 'activityInvitation',
    as: 'InvitedUsers'
});
// Company.hasMany(Activity);
Activity.hasMany(ActivityException, { as: 'exceptions' });

// User.Contacts = User.belongsToMany(User, { through: Contact, as: 'contacts' });

Conversation.hasMany(Message);
User.belongsToMany(Conversation, { through: 'conversationParticipant' });
Message.belongsTo(User, { as: 'sender' });

Jobseeker.Interests = Jobseeker.belongsToMany(Interest, {
    through: JobseekerInterest
});
Interest.Jobseekers = Interest.belongsToMany(Jobseeker, {
    through: JobseekerInterest
});
Interest.Employees = Interest.belongsToMany(Employee, {
    through: EmployeeInterest
});
Employee.InterestsWanted = Employee.belongsToMany(Interest, {
    through: EmployeeInterest
});
JobseekerInterest.Ratings = JobseekerInterest.hasMany(InterestRating);
InterestRating.Employee = InterestRating.belongsTo(Employee);
// InterestRating.Company = InterestRating.belongsTo(Company);

Jobseeker.Skills = Jobseeker.belongsToMany(Skill, { through: JobseekerSkill });
Skill.Jobseekers = Skill.belongsToMany(Jobseeker, { through: JobseekerSkill });
Skill.Employees = Skill.belongsToMany(Employee, { through: EmployeeSkill });
Employee.SkillsWanted = Employee.belongsToMany(Skill, {
    through: EmployeeSkill
});
JobseekerSkill.Ratings = JobseekerSkill.hasMany(SkillRating);
SkillRating.Employee = SkillRating.belongsTo(Employee, {
    as: 'ratedByEmployee'
});
// SkillRating.Company = SkillRating.belongsTo(Company, { as: 'ratedByCompany' });

//  This is only for testing purposes to be able to log in with the dummy users
const Auth = require('./components/auth/auth.js');
const auth = new Auth();

sq.sync({ force: true })
    .then(() => {
        console.log('sequelize initiated');
        return auth.hash('passord123');
    })
    .then(passHash => {
        const user1 = User.build(
            {
                firstName: 'ask',
                lastName: 'yo',
                profilePicturePath: 'Hello',
                profileDescription: 'Hei, jeg er en kul type!',
                userType: 'employee',
                login: {
                    email: 'ask@ask.no',
                    passwordHash: passHash
                },
                employee: {
                    role: 'Rekrutteringsansvarlig',
                    company: 'DNB'
                }
            },
            {
                include: [
                    {
                        association: User.Login
                    },
                    {
                        association: User.Employee
                    }
                ]
            }
        );
        const user2 = User.build(
            {
                firstName: 'ask',
                lastName: 'nje',
                profilePicturePath: '/usr/bin/firefox',
                userType: 'jobseeker',
                login: {
                    email: 'yo@yo.net',
                    passwordHash: passHash
                },
                jobseeker: {
                    type: 'Student',
                    education: 'Bachelor i sykepleie'
                }
            },
            {
                include: [
                    {
                        association: User.Login
                    },
                    {
                        association: User.Jobseeker
                    }
                ]
            }
        );

        Promise.all([user1.save(), user2.save()]).then(() => {
            user1.addContact(user2);
            user2.addContact(user1);
        });

        Skill.findOrCreate({ where: { name: 'Videoredigering' } });
        Skill.findOrCreate({ where: { name: 'Salg' } });
        Skill.findOrCreate({ where: { name: 'Vasking' } });
        Skill.findOrCreate({ where: { name: 'Baking' } });
        Skill.findOrCreate({ where: { name: 'Sterk' } });
        Skill.findOrCreate({ where: { name: 'Sykkelreparasjon' } });
        Skill.findOrCreate({ where: { name: 'Grafisk design' } });
        Skill.findOrCreate({ where: { name: 'Tekstredigering' } });
        Skill.findOrCreate({ where: { name: 'Nettverksbygging' } });
        Skill.findOrCreate({ where: { name: 'Programmering' } });

        Interest.findOrCreate({ where: { name: 'Avengers' } });
        Interest.findOrCreate({ where: { name: 'Transformers' } });
        Interest.findOrCreate({ where: { name: 'Lese bøker' } });
        Interest.findOrCreate({ where: { name: 'Rappe' } });
        Interest.findOrCreate({ where: { name: 'Avengers' } });
        Interest.findOrCreate({ where: { name: 'Musikk' } });
        Interest.findOrCreate({ where: { name: 'Fotografi' } });
        Interest.findOrCreate({ where: { name: 'Fjellturer' } });
        Interest.findOrCreate({ where: { name: 'Svømming' } });
        Interest.findOrCreate({ where: { name: 'Fotball' } });
    })
    .catch(e => {
        console.log(`error: ${e}`);
    });

module.exports = {
    User,
    Login,
    Activity,
    // Company,
    Employee,
    Jobseeker,
    Skill,
    JobseekerSkill,
    EmployeeSkill,
    Interest,
    JobseekerInterest,
    EmployeeInterest,
    ContactRequest
};
