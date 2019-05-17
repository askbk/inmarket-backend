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

const Company = Models.Company(sq, Sq);
const Login = Models.Login(sq, Sq);
const Employee = Models.Employee(sq, Sq);
const Activity = Models.Activity(sq, Sq);
const ActivityException = Models.ActivityException(sq, Sq);
const Jobseeker = Models.Jobseeker(sq, Sq);
const Skill = Models.Skill(sq, Sq);
const SkillRating = Models.SkillRating(sq, Sq);
const JobseekerSkill = Models.JobseekerSkill(sq, Sq);
const Interest = Models.Interest(sq, Sq);
const InterestRating = Models.InterestRating(sq, Sq);
const JobseekerInterest = Models.JobseekerInterest(sq, Sq);
const User = Models.User(sq, Sq);
const Conversation = Models.Conversation(sq, Sq);
const Message = Models.Message(sq, Sq);
// Contact model has to be defined here because we want the foreign keys to also be primary keys
const Contact = sq.define('contact', {
    contactee: {
        type: Sq.INTEGER,
        unique: 'contactIndex',
        references: {
            model: User,
            key: 'id'
        }
    },
    contacter: {
        type: Sq.INTEGER,
        unique: 'contactIndex',
        references: {
            model: User,
            key: 'id'
        }
    }
});

Login.User = Login.belongsTo(User);
Employee.User = Employee.belongsTo(User);
Jobseeker.User = Jobseeker.belongsTo(User);
Jobseeker.MonitoringCompany = Jobseeker.belongsTo(Company, {
    as: 'monitoringCompany'
});
Company.User = Company.belongsTo(User);
Company.Employees = Company.hasMany(Employee);

User.Activities = User.belongsToMany(Activity, {
    through: 'activityParticipant'
});
User.ActivityInvitations = User.belongsToMany(Activity, {
    through: 'activityInvitation', as: 'ActivityInvitations'
});
Activity.InvitedUsers = Activity.belongsToMany(User, {
    through: 'activityInvitation', as: 'InvitedUsers'
});
Company.hasMany(Activity);
Activity.hasMany(ActivityException, { as: 'exceptions' });

Conversation.hasMany(Message);
User.belongsToMany(Conversation, { through: 'conversationParticipant' });
Message.belongsTo(User, { as: 'sender' });

Jobseeker.Skills = Jobseeker.belongsToMany(Skill, { through: JobseekerSkill });
Employee.SkillsWanted = Employee.belongsToMany(Skill, {
    through: 'employeeWantsSkill'
});
JobseekerSkill.Ratings = JobseekerSkill.hasMany(SkillRating);
SkillRating.Employee = SkillRating.belongsTo(Employee, {
    as: 'ratedByEmployee'
});
SkillRating.Company = SkillRating.belongsTo(Company, { as: 'ratedByCompany' });

Jobseeker.Interests = Jobseeker.belongsToMany(Interest, {
    through: JobseekerInterest
});
Employee.InterestsWanted = Employee.belongsToMany(Interest, {
    through: 'employeeWantsInterest'
});
JobseekerInterest.Ratings = JobseekerInterest.hasMany(InterestRating);
InterestRating.Employee = InterestRating.belongsTo(Employee, {
    as: 'ratedByEmployee'
});
InterestRating.Company = InterestRating.belongsTo(Company, {
    as: 'ratedByCompany'
});

//  This is only for testing purposes to be able to log in with the dummy users
const Auth = require('./components/auth/auth.js');
const auth = new Auth();

sq.sync({ force: true })
    .then(() => {
        console.log('sequelize initiated');
        return auth.hash('passord123');
    })
    .then(passHash => {
        User.bulkCreate([
            {
                firstName: 'ask',
                lastName: 'yo',
                profilePicturePath: 'Hello',
                profileDescription: 'Hei, jeg er en kul type!'
            },
            {
                firstName: 'ask',
                lastName: 'nje',
                profilePicturePath: '/usr/bin/firefox'
            }
        ]).then(users => {
            Login.bulkCreate([
                {
                    email: 'ask@ask.no',
                    passwordHash: passHash,
                    userId: users[0].id
                },
                {
                    email: 'yo@yo.net',
                    passwordHash: passHash,
                    userId: users[1].id
                }
            ]);
        });

        Skill.findOrCreate({ where: { name: 'Videoredigering' } });
        Skill.findOrCreate({ where: { name: 'Salg' } });
        Skill.findOrCreate({ where: { name: 'Vasking' } });
        Skill.findOrCreate({ where: { name: 'Baking' } });

        Interest.findOrCreate({ where: { name: 'Avengers' } });
        Interest.findOrCreate({ where: { name: 'Transformers' } });
        Interest.findOrCreate({ where: { name: 'Lese bøker' } });
        Interest.findOrCreate({ where: { name: 'Rappe' } });
    })
    .catch(e => {
        console.log(`error: ${e}`);
    });

module.exports = {
    User,
    Login,
    Activity,
    Company,
    Employee,
    Jobseeker,
    Skill,
    JobseekerSkill,
    Interest,
    JobseekerInterest,
    Contact
};
