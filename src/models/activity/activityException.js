module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class ActivityException extends Model {}
    ActivityException.init(
        {
            instanceId: {
                type: Sq.INTEGER,
                allowNull: false
            },
            exceptionDateUTC: {
                type: Sq.DATE,
                allowNull: false
            },
            isCancelled: {
                type: Sq.BOOLEAN,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'activityException'
        }
    );

    return ActivityException;
};
