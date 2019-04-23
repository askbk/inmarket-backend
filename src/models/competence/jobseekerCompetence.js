module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class JobseekerCompetence extends Model {}
    JobseekerCompetence.init({}, {
        sequelize,
        modelName: "jobseekerCompetence"
    });

    return JobseekerCompetence;
}
