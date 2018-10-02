import passportLocal from 'passport-local'


module.exports =  function (User, passport) {
    let LocalStrategy = passportLocal.Strategy;

    passport.serializeUser(function (user, done) {
        console.log('bb')
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id).then(function (user) {
            console.log('aa')
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
                    $or: [
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
