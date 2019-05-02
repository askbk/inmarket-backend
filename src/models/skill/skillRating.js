module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class SkillRating extends Model {}
    SkillRating.init({
        rating: {
            type: Sq.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "skillRating"
    });

    return SkillRating;
}
