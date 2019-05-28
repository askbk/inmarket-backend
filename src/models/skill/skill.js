module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Skill extends Model {}
    Skill.init(
        {
            name: {
                type: Sq.STRING,
                allowNull: false,
                unique: true
            }
        },
        {
            sequelize,
            modelName: 'skill'
        }
    );

    return Skill;
};
