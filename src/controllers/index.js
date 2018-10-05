import models from './../models'
import {createHashedPassword} from './../helpers'


const randomString = () => {
    return Math.random().toString().substr(2)
}

export const searchCourseTemplate = (req, res) => {
    if (req.isAuthenticated() && req.user.role == "student") {
        console.log("harsh")
        models.Course.findAll({
            attributes: ['title', 'description', 'createdAt', 'id'],
            include: [{
                model: models.User, as: 'creator',
                attributes: ['username', 'pic']
            }]
        }).then(function (courses){
            // res.redirect(`/${req.user.type}/whiteboard`)
            res.render("xhr", { role: req.user.role, type: 'search-course', courses: courses, layout: 'empty.handlebars' })
        })
    } else {
        res.render("")
    }
}

export const dashboard = (req, res) => {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        res.render('dashboard', { role: req.params.role })
    } else {
        res.redirect(`/${req.params.role}/register`)
    }
}

export const registerCourse = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('search-course', { role: req.params.role })
    } else {
        res.redirect(`/${req.params.role}/register`)
    }
}

export const searchCourse = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('dashboard', { role: req.params.role })
    } else {
        res.redirect(`/${req.params.role}/register`)
    }
}

export const register = (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect(`/${req.user.role}/dashboard`)
    } else {
        res.render('register', { role: req.params.role })
    }
}

export const profile = (req, res) => {
    if (req.isAuthenticated()) {
        // res.redirect(`/${req.user.type}/whiteboard`)
        if (req.user.role == "tutor") {
            models.Course.findAll({
                attributes: ['password', 'title', 'description', 'createdAt'],
                where: [{
                    creatorId: req.user.id
                }]
            }).then(function (courses) {
                console.log(courses)
                // res.status(200).json({message: courses})
                res.render("profile", { role: req.user.role, courses: courses })
            })
        }
        else if (req.user.role == "student") {
            models.User.findAll({
                where: [{
                    id: req.user.id
                }],
                attributes: ['username'],
                include: [{
                    model: models.Course, as: 'courses',
                    attributes: ['title', 'description', 'createdAt'],
                    through: {
                        attributes: ['CourseId', 'UserId'],
                    }
                }]
            }).then(function (courses) {
                console.log(courses)
                res.render("profile", { role: req.user.role })
            })
        }

    } else {
        res.redirect(`/${req.params.role}/register`)
    }
}

export const addCourse = (req, res) => {
    if (req.isAuthenticated() && req.user.role == "tutor") {
        models.Course.create({
            'title': req.body.title.trim(),
            'description': req.body.description.trim(),
            'creatorId': req.user.id,
            'password': randomString()
        }).then(function (course) {
            if (course) {
                // res.status(201).json({ message: 'User created' })
                res.redirect(`/tutor/profile`)
            } else {
                res.status(500).json({ message: 'Server error' })
            }
        })
    } else {
        res.redirect(`/tutor/profile`)
    }
}

export const registerUser = (req, res) => {
    let validRole = ['tutor', 'student'];
    if (validRole.indexOf(req.params.role) == -1) {
        res.status(400).json({ message: 'Bad url' });
        return
    }

    models.User.findOne({
        where: {
            email: req.body.email,
        }
    }).then(function (user) {
        if (user) {
            res.status(400).json({ message: 'That email is already taken' })
        } else {
            let hash = createHashedPassword(req.body.password);

            let trimedObject = {
                firstname: req.body.firstname.trim(),
                lastname: req.body.lastname.trim(),
                username: req.body.username.trim(),
                email: req.body.email.trim(),
                role: req.params.role,
                password: hash,
                gender: req.body.gender,
                pic: '/images/avatar/matthew.png'
            }

            if (req.body.password == req.body.passwordCon) {
            }
            else {
                res.status(400).json({ message: 'password don\'t match.' })
                return
            }

            models.User.create(trimedObject).then(function (newUser, created) {
                if (newUser) {
                    // res.status(201).json({ message: 'User created' })
                    res.render('register', { role: req.params.role })
                } else {
                    res.status(500).json({ message: 'Server error' })
                }
            }).catch(function (error) {
                res.status(400).json({ message: 'Bad request' });
            });
        }
    })
}

// export const loginUser = (req, res) => {
//     let saltedpassword, hashedpassword;
//     ifUserPresent(req.body.email.trim(), (err, results) => {
//         saltedpassword = results[0].salt + req.body.password.trim()
//         hashedpassword = sha1passwordHasher(saltedpassword)
//         if (hashedpassword == results[0].password) {
//             let generatedCookie = randomString()

//             let d = new Date()
//             d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
//             res.cookie('3dcookie', generatedCookie, { expire: d.toUTCString() })
//             insertCookie({
//                 cookie: generatedCookie,
//                 email: req.body.email
//             }, (err, result) => {
//                 if (err) {
//                     res.status(500).json({ message: 'some error' })
//                 } else {
//                     res.redirect('/dashboard')
//                 }
//             })
//         }
//         else {
//             res.status(400).json({ message: 'wrong credentials' });
//         }

//     })
// }



