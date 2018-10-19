import passportLocal from 'passport-local'
import passportFacebook from 'passport-facebook'
import Sequelize from 'sequelize'
let Op = Sequelize.Op
import models from './../models'
import { getPicture } from './../helpers'
import Mitter from '@mitter-io/node'
import passportGoogle from 'passport-google-oauth'


import dotenv from 'dotenv'
dotenv.config()


const mitter = Mitter.Mitter.forNode(
    process.env.MITTER_APPLICATION_ID,
    {
        "accessKey": process.env.MITTER_ACCESS_KEY,
        "accessSecret": process.env.MITTER_ACCESS_SECRET
    }
)

const userAuthClient = mitter.clients().userAuth()
const userClient = mitter.clients().users()

module.exports = function (User, passport) {
    let LocalStrategy = passportLocal.Strategy;
    let GoogleStrategy = passportGoogle.OAuth2Strategy;
    let FacebookStrategy = passportFacebook.Strategy;

    passport.serializeUser(function (user, done) {
        let res = user[1]
        user = user[0]
        console.log('searialUser')

        let data = {
            id: user.id,
            role: user.role,
            name: user.firstname + ' ' + user.lastname,
            username: user.username
        }
        const createUser = userClient.createUser({
            userId: `user-${data.id}`,
            userLocators: [],
            systemUser: false,
            screenName: {
                screenName: data.name
            }
        }).catch((e) => {
            console.log(e)
            if (!(e.response.status === 409 && e.response.data.errorCode === 'duplicate_entity')) {
                throw e
            }
        })

        createUser.then(() => userAuthClient.getUserToken(`user-${data.id}`))
            .then(token => {
                data['token'] = token.userToken.signedToken
                res.cookie('recipient', data.token)
                res.cookie('applicationId', process.env.MITTER_APPLICATION_ID)
                done(null, data);
            })
            .catch(e => {
                console.error('Error executing request, setting 500', e)
                done(e, null);
            })

    });

    passport.deserializeUser(function (key, done) {
        // console.log(key)
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
        passReqToCallback: true,
        callbackURL: `${process.env.website}/auth/facebook/callback`
    },
        function (req, accessToken, refreshToken, profile, done) {
            console.log(profile)
            let role = req.cookies.role
            let gender = profile.gender
            let email = profile.id + '@facebook.com'
            // let email = profile.emails[0].value
            let obj = {
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                username: profile.username,
                email: email,
                role: role ? role : "student",
                password: profile.provider,
                gender: gender ? gender : "male",
                pic: getPicture(gender)
            }
            console.log(obj)
            User.findOrCreate({
                where: {
                    email: email
                },
                defaults: obj
            }).spread(function (userResult, created) {
                if (!userResult) { return done(null); }
                done(null, userResult);
            })
        }
    ));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        passReqToCallback: true,
        callbackURL: `${process.env.website}/auth/google/callback`
    },
        function (req, accessToken, refreshToken, profile, done) {
            console.log(profile)
            let role = req.cookies.role
            console.log(req.cookies)
            let gender = profile.gender
            let email = profile.emails[0].value
            email ? email : profile.id + '@gmail.com'
            let obj = {
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                username: profile.id.toString(),
                email: email,
                role: 'student',
                password: profile.provider,
                gender: gender ? gender : "male",
                pic: profile.photos[0].value
            }
            console.log(obj)
            User.findOrCreate({
                where: {
                    email: email
                },
                defaults: obj
            }).spread(function (userResult, created) {
                if (!userResult) { return done(null); }
                done(null, userResult);
            })
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
