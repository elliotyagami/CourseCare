export default function(sequelize, Sequelize) {

    var Token = sequelize.define('Token', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        token: {
            type: Sequelize.STRING,
            notEmpty: true
        }

    });

    Token.associate = function (models) {
        models.User.hasMany(Token, {
          as: 'token'
        })
        Token.belongsTo(models.User)
      };

    return Token;
}


