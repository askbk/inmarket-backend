module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Conversation extends Model {}
    Conversation.init({
        name: {
            type: Sq.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "conversation"
    });

    return Conversation;
}
