module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class User extends Model {}
    User.init({
        id: {
            type: Sq.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sq.STRING,
            allowNull: false
        },
        email: {
            type: Sq.STRING,
            allowNull: false
        },
        password: {
            type: Sq.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "user"
    });

    return User;
}
