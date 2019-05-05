const Sq        = require('sequelize');
const Models    = require("./models");
const sq = new Sq(
    "inmarket_db",
    "ask",
    "123", {
    host: "database",
    dialect: "mariadb"
});

sq
.authenticate()
.then(() => {
    console.log('Database connected');
})
.catch(err => {
    console.error('Unable to connect to database:', err);
});

const Company           = Models.Company(sq, Sq);
const Login             = Models.Login(sq, Sq);
const Employee          = Models.Employee(sq, Sq);
const Activity          = Models.Activity(sq, Sq);
const ActivityException = Models.ActivityException(sq, Sq);
const Jobseeker         = Models.Jobseeker(sq, Sq);
const Skill             = Models.Skill(sq, Sq);
const SkillRating       = Models.SkillRating(sq, Sq);
const JobseekerSkill    = Models.JobseekerSkill(sq, Sq);
const User              = Models.User(sq, Sq);
const Conversation      = Models.Conversation(sq, Sq);
const Message           = Models.Message(sq, Sq);
const Contact           = Models.Contact(sq, Sq);

//  Define relations here...
Login.User = Login.belongsTo(User);
Employee.User = Employee.belongsTo(User);
Jobseeker.User = Jobseeker.belongsTo(User);
Jobseeker.MonitoringCompany = Jobseeker.belongsTo(Company, {as: "monitoringCompany"});
Company.User = Company.belongsTo(User);
Company.Empoyees = Company.hasMany(Employee, {as: "employees"});

Jobseeker.Activities = Jobseeker.belongsToMany(Activity, {through: "activityParticipant"});
Jobseeker.ActivityInvirations = Jobseeker.belongsToMany(Activity, {through: "activityInvitation"});
Employee.hasMany(Activity, {as: "createdActivities"});
Company.hasMany(Activity);
Activity.hasMany(ActivityException, {as: "exceptions"});

User.belongsToMany(User, {through: Contact, as: "contacts"});

Conversation.hasMany(Message);
User.belongsToMany(Conversation, {through: "conversationParticipant"});
Message.belongsTo(User, {as: "sender"});

Jobseeker.Skills = Jobseeker.belongsToMany(Skill, {through: JobseekerSkill});
Employee.SkillsWanted = Employee.belongsToMany(Skill, {through: "employeeWantsSkill"});
JobseekerSkill.Ratings = JobseekerSkill.hasMany(SkillRating)
SkillRating.Employee = SkillRating.belongsTo(Employee, {as: "ratedByEmployee"});
SkillRating.Company = SkillRating.belongsTo(Company, {as: "ratedByCompany"});

//  This is only for testing purposes to be able to log in with the dummy users
const Auth = require("./components/auth/auth.js");
const auth = new Auth();

sq.sync(
    {force: true}
).then(() => {
    console.log("sequelize initiated");
    return auth.hash("passord123");
}).then(passHash => {
    User.bulkCreate([
        {firstName: "ask", lastName: "yo", profilePicturePath: "Hello", profileDescription: "Hei, jeg er en kul type!"},
        {firstName: "ask", lastName: "nje", profilePicturePath: "/usr/bin/firefox"}
    ]).then(users => {
        Login.bulkCreate([
            {email: "ask@ask.no", passwordHash: passHash, userId: users[0].id},
            {email: "yo@yo.net", passwordHash: passHash, userId: users[1].id}
        ]);
    });

    Skill.findOrCreate({where: {name: "Videoredigering"}});
    Skill.findOrCreate({where: {name: "Salg"}});
    Skill.findOrCreate({where: {name: "Vasking"}});
    Skill.findOrCreate({where: {name: "Baking"}});
}).catch(e => {
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
    JobseekerSkill
}
