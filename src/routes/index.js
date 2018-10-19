// import express from 'express'
// import passport from 'passport'

// let router = express.Router();

import student from './students'
import tutor from './tutors'
import bcrypt from 'bcryptjs'
import { registerUser, register, dashboard, whiteboard, discussion} from './../controllers'

module.exports =  function (app, passport) {

    app.get('/', (req, res) => {
        res.status(200).json({ "status": "running" });
    })

    app.get('/:role/register', register)
    app.post('/:role/register', registerUser)

    app.get('/:role/dashboard', dashboard)

    app.get('/whiteboard', whiteboard)
    app.get('/discussion', discussion)

    app.post('/:role/login', function (req, res, next) {

        passport.authenticate('local-login', function (err, user, info) {
            if (!user) { res.redirect(`/${req.params.role}/register`); }
            if (user)
            req.logIn(user, function(err) {
                res.redirect(`/${req.user.role}/dashboard`);
            })
        })(req, res, next)
    })


    app.get('/tutor', tutor)

    app.get('/student', student)

    app.get('/logout', function (req, res) {
        req.logout();
        // req.flash('success_msg', 'You are logged out');
        res.redirect('/student/signin');
    });

}

