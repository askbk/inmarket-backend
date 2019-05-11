module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class EmployeeInterest extends Model {}
    EmployeeInterest.init({
        isActive: {
            type: Sq.BOOLEAN,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "EmployeeInterest"
    });

    return EmployeeInterest;
}
