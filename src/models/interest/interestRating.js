module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class InterestRating extends Model {}
    InterestRating.init(
        {
            rating: {
                type: Sq.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'interestRating'
        }
    );

    return InterestRating;
};
