export default function(sequelize, Sequelize) {

    var Course = sequelize.define('Course', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        title: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        password: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        description: {
            type: Sequelize.TEXT,
            notEmpty: false
        }
    });

    Course.associate = function (models) {
        console.log(models)
        Course.belongsTo(models.User, {
          as: 'creator'
        });
        Course.belongsToMany(models.User,  {through: 'CourseRegister',  as: 'students'});
        // console.log(Course.prototype)
      };

    return Course;
}


