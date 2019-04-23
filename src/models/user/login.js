module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Login extends Model {}
    Login.init({
        email: {
            type: Sq.STRING,
            allowNull: false
        },
        passwordHash: {
            type: Sq.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: "login"
    });

    return Login;
}
