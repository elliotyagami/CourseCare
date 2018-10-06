import passportLocal from 'passport-local'
import Sequelize from 'sequelize'
let Op = Sequelize.Op

module.exports =  function (User, passport) {
    let LocalStrategy = passportLocal.Strategy;

    passport.serializeUser(function (user, done) {
        console.log('searialUser')
        let data = {
            id: user.id,
            role: user.role,
        }
        done(null, data);
    });

    passport.deserializeUser(function (key, done) {
        User.findById(key.id).then(function (user) {
            console.log('desearialUser')
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use('local-login', new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
            User.findOne({
                where: {
                    [Op.or]: [
                        { username: username },
                        { email: username }
                    ]
                }
            }).then(function (user) {
                if (!user) {
                    return done(null, false, { message: "User doesn't exist" });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        })
    );

}
