// import express from 'express'
// import passport from 'passport'

// let router = express.Router();

import bcrypt from 'bcryptjs'
// import tutor from './tutor'
// import student from './student'
import { registerUser, register, dashboard, profile, addCourse, registerCourse, courseList, searchCourseTemplate} from './../controllers'
import { whiteboard, discussion, addCourseTemplate,registerCourseTemplate} from './../controllers/ajax'

module.exports =  function (app, passport) {

    app.get('/', (req, res) => {
        res.status(200).json({ "status": "running" });
    })

    app.get('/whiteboard', whiteboard)
    app.get('/discussion', discussion)
    app.get('/course/add', addCourseTemplate)
    app.get('/course/search', searchCourseTemplate)
    app.get('/course/register', registerCourseTemplate)
    app.get('/course/register/:id', registerCourseTemplate)

    app.post('/course/register', registerCourse)
    app.post('/course/add', addCourse)
    app.get('/course/list', courseList)

    app.get('/:role/register', register)
    app.post('/:role/register', registerUser)
    app.get('/:role/dashboard', dashboard)
    app.get('/:role/profile', profile)
    app.get('/:role/dashboard/:id', dashboard)

    app.post('/:role/login', function (req, res, next) {

        passport.authenticate('local-login', function (err, user, info) {
            if (!user) { res.redirect(`/${req.params.role}/register`); }
            if (user)
            req.logIn(user, function(err) {
                res.redirect(`/${req.user.role}/dashboard`);
            })
        })(req, res, next)
    })


    // app.use('/tutor', tutor)
    // app.use('/student', student)

    app.get('/logout', function (req, res) {
        let role = req.user.role;
        role = role ? role : 'student';
        req.logout();
        // req.flash('success_msg', 'You are logged out');
        res.redirect(`/${role}/register`);
    });

}

