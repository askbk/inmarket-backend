module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class JobseekerSkill extends Model {}
    JobseekerSkill.init(
        {
            isActive: {
                type: Sq.BOOLEAN,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'jobseekerSkill'
        }
    );

    return JobseekerSkill;
};
