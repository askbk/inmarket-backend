module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Employee extends Model {}
    Employee.init(
        {
            role: {
                type: Sq.STRING,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'employee'
        }
    );

    return Employee;
};
