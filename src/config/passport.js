import passportLocal from 'passport-local'
import passportFacebook from 'passport-facebook'
import Sequelize from 'sequelize'
let Op = Sequelize.Op

import dotenv from 'dotenv'
dotenv.config()

module.exports =  function (User, passport) {
    let LocalStrategy = passportLocal.Strategy;
    let FacebookStrategy = passportFacebook.Strategy;

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

    passport.use(new FacebookStrategy({
        clientID: process.env.facebook_api_key,
        clientSecret: process.env.facebook_api_secret,
        callbackURL: `${process.env.website}/auth/facebook/callback`
      },
      function(accessToken, refreshToken, profile, done) {
          console.log(profile)
        // User.findOrCreate({

        // }, function(err, user) {
        //   if (err) { return done(err); }
        //   done(null, user);
        // });
      }
    ));

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
