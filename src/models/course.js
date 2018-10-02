export default function(sequelize, Sequelize) {

    var Course = sequelize.define('course', {

        course_id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        title: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        description: {
            type: Sequelize.TEXT,
            notEmpty: false
        },

        tutor_id: {
            type: Sequelize.INTEGER,
            notEmpty: true
        }
    });

    return Course;
}


