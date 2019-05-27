module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class EmployeeSkill extends Model {}
    EmployeeSkill.init(
        {
            isActive: {
                type: Sq.BOOLEAN,
                defaultValue: true,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'employeeSkill'
        }
    );

    return EmployeeSkill;
};
