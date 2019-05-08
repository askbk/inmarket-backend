module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Contact extends Model {}
    Contact.init(
        {},
        {
            sequelize,
            modelName: 'contact'
        }
    );

    return Contact;
};
