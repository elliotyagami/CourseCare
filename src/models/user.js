import bcrypt from 'bcryptjs'

export default function(sequelize, Sequelize) {

    var User = sequelize.define('User', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        firstname: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        lastname: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        username: {
            type: Sequelize.STRING,
            unique: true
        },

        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true,
            },
            unique: true
        },

        password: {
            type: Sequelize.STRING,
            allowNull: false
        },

        role: {
            type: Sequelize.STRING,
            allowNull: false
        },
        gender: {
            type: Sequelize.STRING,
            allowNull: false
        },
        pic: {
            type: Sequelize.STRING,
            allowNull: false
        },

    });

    User.associate = function (models) {
        User.belongsToMany(models.Course,  {through: 'CourseRegister', as: 'courses'});
    }
    User.prototype.validPassword =  function (password) {
        return bcrypt.compareSync(password, this.password)
    }

    return User;
}


