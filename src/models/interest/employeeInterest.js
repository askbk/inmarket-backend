module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class EmployeeInterest extends Model {}
    EmployeeInterest.init({
        isActive: {
            type: Sq.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "employeeInterest"
    });

    return EmployeeInterest;
}
