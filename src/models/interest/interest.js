module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Interest extends Model {}
    Interest.init({
        name: {
            type: Sq.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: "interest"
    });

    return Interest;
}
