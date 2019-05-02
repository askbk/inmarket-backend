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

const Company               = Models.Company(sq, Sq);
const Login                 = Models.Login(sq, Sq);
const Employee              = Models.Employee(sq, Sq);
const Activity              = Models.Activity(sq, Sq);
const ActivityException     = Models.ActivityException(sq, Sq);
const Jobseeker             = Models.Jobseeker(sq, Sq);
const Competence            = Models.Competence(sq, Sq);
const CompetenceRating      = Models.CompetenceRating(sq, Sq);
const JobseekerCompetence   = Models.JobseekerCompetence(sq, Sq);
const User                  = Models.User(sq, Sq);
const Conversation          = Models.Conversation(sq, Sq);
const Message               = Models.Message(sq, Sq);
const Contact               = Models.Contact(sq, Sq);

//  Define relations here...
Login.belongsTo(User);
Employee.belongsTo(User);
Jobseeker.belongsTo(User);
Jobseeker.belongsTo(Company, {as: "monitoringCompany"});
Company.belongsTo(User);
Company.hasMany(Employee, {as: "employees"});

Jobseeker.belongsToMany(Activity, {through: "activityParticipant"});
Jobseeker.belongsToMany(Activity, {through: "activityInvitation"});
Employee.hasMany(Activity, {as: "createdActivities"});
Company.hasMany(Activity);
Activity.hasMany(ActivityException, {as: "exceptions"});

User.belongsToMany(User, {through: Contact, as: "contacts"});

Conversation.hasMany(Message);
User.belongsToMany(Conversation, {through: "conversationParticipant"});
Message.belongsTo(User, {as: "sender"});

Competence.belongsToMany(Jobseeker, {through: JobseekerCompetence});
JobseekerCompetence.hasMany(CompetenceRating)
CompetenceRating.belongsTo(Employee, {as: "ratedByEmployee"});
CompetenceRating.belongsTo(Company, {as: "ratedByCompany"});

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
}).catch(e => {
    console.log(`error: ${e}`);
});

module.exports = {
    User,
    Login,
    Activity,
    Company,
    Employee,
    Jobseeker
}
