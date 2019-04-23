module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class CompetenceRating extends Model {}
    CompetenceRating.init({
        rating: {
            type: Sq.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "competenceRating"
    });

    return CompetenceRating;
}
