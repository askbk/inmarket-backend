module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Company extends Model {}
    Company.init(
        {
            name: {
                type: Sq.STRING,
                allowNull: false
            },
            webpage: {
                type: Sq.STRING,
                allowNull: true
            },
            registrationCode: {
                type: Sq.INTEGER,
                allowNull: true
            },
            orgNumber: {
                type: Sq.STRING,
                allowNull: false,
                unique: true
            }
        },
        {
            sequelize,
            modelName: 'company'
        }
    );

    return Company;
};
