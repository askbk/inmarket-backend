module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Jobseeker extends Model {}
    Jobseeker.init({
        type: {
            type: Sq.STRING,
            allowNull: true
        },
        education: {
            type: Sq.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: "jobseeker"
    });

    return Jobseeker;
}
