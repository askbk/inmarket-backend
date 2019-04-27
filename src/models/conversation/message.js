module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Message extends Model {}
    Message.init({
        content: {
            type: Sq.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "message"
    });

    return Message;
}
