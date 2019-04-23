const Sq = require('sequelize');
const Models = require("./models");
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

//  Define relations here...
Login.belongsTo(User);
Employee.belongsTo(User);
Jobseeker.belongsTo(User);
Jobseeker.belongsTo(Company, {as: "MonitoringCompany"});
Jobseeker.belongsToMany(Activity, {through: "ActivityParticipant"});
Jobseeker.belongsToMany(Activity, {through: "ActivityInvitation"});
Company.belongsTo(User);
Company.hasMany(Employee, {as: "Employees"});
Employee.hasMany(Activity, {as: "CreatedActivities"});
Company.hasMany(Activity);

User.belongsToMany(User, {through: "Contact", as: "Contacts"});
User.belongsToMany(User, {through: "ContactRequest", as: "ContactRequests"});

Activity.hasMany(ActivityException, {as: "Exceptions"});

Competence.belongsToMany(Jobseeker, {through: JobseekerCompetence});
JobseekerCompetence.hasMany(CompetenceRating)
CompetenceRating.belongsTo(Employee, {as: "RatedByEmployee"});
CompetenceRating.belongsTo(Company, {as: "RatedByCompany"});

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
