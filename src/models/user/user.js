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
        },
        isAdmin: {
            type: Sq.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        profileDescription: {
            type: Sq.STRING,
            allowNull: false,
            defaultValue: "Denne brukeren har ingen beskrivelse :( ;)"
        }
    }, {
        sequelize,
        modelName: "user"
    });

    return User;
}
