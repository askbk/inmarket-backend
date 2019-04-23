module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class User extends Model {}
    User.init({
        firstName: {
            type: Sq.STRING,
            allowNull: false
        },
        lastName: {
            type: Sq.STRING,
            allowNull: false
        },
        profilePicturePath: {
            type: Sq.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: "user"
    });

    return User;
}
