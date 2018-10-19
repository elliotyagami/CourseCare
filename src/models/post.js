export default function(sequelize, Sequelize) {

    var Post = sequelize.define('Post', {

        id: {
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
        }
    });

    Post.associate = function (models) {
        Post.belongsTo(models.User,{as: 'creator'})
        Post.belongsTo(models.Course,{as: 'course'})
    };

    return Post;
}


