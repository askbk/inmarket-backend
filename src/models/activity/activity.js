module.exports = (sequelize, Sq) => {
    const Model = Sq.Model;
    class Activity extends Model {}
    Activity.init(
        {
            name: {
                type: Sq.STRING,
                allowNull: false
            },
            description: {
                type: Sq.STRING,
                allowNull: true
            },
            startDateUTC: {
                type: Sq.DATE,
                allowNull: false
            },
            endDateUTC: {
                type: Sq.DATE,
                allowNull: false
            },
            duration: {
                type: Sq.INTEGER,
                allowNull: false
            },
            isRecurring: {
                type: Sq.BOOLEAN,
                allowNull: false
            },
            recurrencePattern: {
                type: Sq.STRING,
                allowNull: true
            },
            location: {
                type: Sq.STRING,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'activity'
        }
    );

    return Activity;
};
