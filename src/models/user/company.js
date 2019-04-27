module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Company extends Model {}
    Company.init({
        name: {
            type: Sq.STRING,
            allowNull: false
        },
        orgNumber: {
            type: Sq.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: "company"
    });

    return Company;
}
