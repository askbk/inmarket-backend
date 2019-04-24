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

const Company = Models.Company(sq, Sq);
const Login = Models.Login(sq, Sq);
const Employee = Models.Employee(sq, Sq);
const Activity = Models.Activity(sq, Sq);
const ActivityException = Models.ActivityException(sq, Sq);
const Jobseeker = Models.Jobseeker(sq, Sq);
const Competence = Models.Competence(sq, Sq);
const CompetenceRating = Models.CompetenceRating(sq, Sq);
const JobseekerCompetence = Models.JobseekerCompetence(sq, Sq);
const User = Models.User(sq, Sq);
const Conversation = Models.Conversation(sq, Sq);
const Message = Models.Message(sq, Sq);

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

User.belongsToMany(User, {through: "contact", as: "contacts"});
User.belongsToMany(User, {through: "contactRequest", as: "contactRequests"});

Conversation.hasMany(Message);
User.belongsToMany(Conversation, {through: "conversationParticipant"});
Message.belongsTo(User, {as: "sender"});

Competence.belongsToMany(Jobseeker, {through: JobseekerCompetence});
JobseekerCompetence.hasMany(CompetenceRating)
CompetenceRating.belongsTo(Employee, {as: "ratedByEmployee"});
CompetenceRating.belongsTo(Company, {as: "ratedByCompany"});

sq.sync(
    {force: false}
).then(() => {
    console.log("sequelize initiated");
}).catch((err) => {
    console.log("error:" + err);
});

module.exports = {
    User,
}
