module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Employee extends Model {}
    Employee.init({
        role: {
            type: Sq.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "employee"
    });

    return Employee;
}
