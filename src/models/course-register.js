export default function(sequelize, Sequelize) {

    var Course = sequelize.define('CourseRegister', {
        // CourseId: {
        //     primaryKey: true,
        //     type: Sequelize.INTEGER
        // },
    });
    return Course;
}


