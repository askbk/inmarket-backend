module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class JobseekerCompetence extends Model {}
    JobseekerCompetence.init({
        isActive: {
            type: Sq.BOOLEAN,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "jobseekerCompetence"
    });

    return JobseekerCompetence;
}
