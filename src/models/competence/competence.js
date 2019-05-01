module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Competence extends Model {}
    Competence.init({
        name: {
            type: Sq.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: "competence"
    });

    return Competence;
}
