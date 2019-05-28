module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class JobseekerInterest extends Model {}
    JobseekerInterest.init(
        {
            isActive: {
                type: Sq.BOOLEAN,
                defaultValue: true,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'jobseekerInterest'
        }
    );

    return JobseekerInterest;
};
