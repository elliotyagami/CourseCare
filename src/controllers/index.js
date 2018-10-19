import models from './../models'
import Sequelize from 'sequelize'
let Op = Sequelize.Op
import { createHashedPassword, getPicture } from './../helpers'


const randomString = () => {
    return Math.random().toString().substr(2)
}

export const searchCourseTemplate = (req, res) => {
    if (req.isAuthenticated() && req.user.role == "student") {
        models.Course.findAll({
            attributes: ['title', 'description', 'createdAt', 'id'],
            include: [{
                model: models.User, as: 'creator',
                attributes: ['username', 'pic']
            }]
        }).then(function (courses) {
            // res.redirect(`/${req.user.type}/whiteboard`)
            res.render("xhr", { userData: req.user, type: 'search-course', courses: courses, layout: 'empty.handlebars' })
        })
    } else {
        res.render("")
    }
}
export const index = (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect(`/${req.user.role}/profile`)

    } else {
        res.render("index")
    }
}
export const courseList = (req, res) => {
    if (req.isAuthenticated() && req.user.role == "tutor") {
        models.Course.findAll({
            attributes: ['title', 'description', 'createdAt', 'id',  'password'],
            wherer: [
                {
                    creatorId: req.user.role
                }
            ],
            // order: ['createdAt DESC']
        }).then(function (courses) {
            res.render("xhr", { userData: req.user, type: 'course-list', courseList: courses, layout: 'empty.handlebars' })
        })
    } else {
        res.render("")
    }
}

let dashboardHandler = (rows,req,res) => {
    if (rows) {
        let obj = {
            id: {
                [Op.ne]: req.params.id
            }
        };
        if (req.user.role == "tutor"){
            obj = {};
        }
        Sequelize.Promise.all([
        models.Course.find({
            where: [{
                id: req.params.id
                }],
                include: [{
                    model: models.User, as: 'students',
                    attributes: ['username', 'pic', 'firstname' , 'lastname', 'id'],
                    where: obj
                }]
            }),
        models.Course.find({
            where: [{
                id: req.params.id
                }],
            include: [{
                model: models.User, as: 'creator',
                attribute:  ['username', 'pic', 'firstname' , 'lastname', 'id']
            }]
        })
    ]).spread(function(c,t){
                console.log(c)
                c = c ? c : {'students': [], 'creator': {}}
                res.cookie('CourseId', req.params.id)
                res.cookie('TutorId', t.creator.id)
                res.render('dashboard', { userData: req.user, course: c.title, students: c.students , tutor: t.creator})
            })
        }else{
            res.status(401).json({'message': 'access denied'})
        }
    }

export const dashboard = (req, res) => {
    if (req.isAuthenticated()) {
        if (req.params.id) {
            if(req.user.role == "student")
            models.CourseRegister.find({
                where: {
                    CourseId: req.params.id,
                    UserId: req.user.id
                }
            }).then((rows) =>dashboardHandler(rows,req,res))

            if(req.user.role == "tutor")
            models.Course.find({
                where: [
                    {
                        id: req.params.id,
                        creatorId: req.user.id
                    }
                ]
            }).then((rows) =>dashboardHandler(rows,req,res))
        }else{
            res.render('dashboard', { userData: {role: req.params.role} })
        }
    } else {
        res.redirect(`/${req.params.role}/register`)
    }
}

export const registerCourse = (req, res) => {
    if (req.isAuthenticated() && req.user.role == "student") {
        models.Course.find({
            attributes: ['title', 'id'],
            where: {
                id: req.body.id,
                password: req.body.password
            }
        }).then(function (course) {
            if (course) {
                models.CourseRegister.create({
                    CourseId: parseInt(req.body.id),
                    UserId: req.user.id
                }).then(function (registered) {
                        res.redirect("/student/profile")
                    })
            }else {
                res.status(401).json({ message: "authorization failed" })
            }
        }).catch(function(err){
            console.log(err)
        })

    } else {
        res.redirect(`/${req.params.role}/profile`)
    }
}

// export const searchCourse = (req, res) => {
//     if (req.isAuthenticated()) {
//         res.render('dashboard', { role: req.params.role })
//     } else {
//         res.redirect(`/${req.params.role}/profile`)
//     }
// }

export const register = (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect(`/${req.user.role}/profile`)
    } else {
        res.render('register', { userData: {role: req.params.role} })
    }
}

export const profile = (req, res) => {
    if (req.isAuthenticated()) {
        // res.redirect(`/${req.user.type}/whiteboard`)
        if (req.user.role == "tutor") {
            models.Course.findAll({
                attributes: ['id','password', 'title', 'description', 'createdAt'],
                where: [{
                    creatorId: req.user.id
                }]
            }).then(function (courses) {
                // res.status(200).json({message: courses})
                res.render("profile", { userData: req.user, courses: courses })
            })
        }
        else if (req.user.role == "student") {
            models.User.find({
                where: [{
                    id: req.user.id
                }],
                attributes: ['username'],
                include: [{
                    model: models.Course, as: 'courses',
                    attributes: ['title', 'description', 'createdAt', 'id'],
                    through: {
                        attributes: ['CourseId', 'UserId'],
                    }
                }]
            }).then(function (user) {
                res.render("profile", { userData: req.user, courses: user.courses })
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
                pic: getPicture(req.body.gender)
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
                    res.render('register', { userData: {role: req.params.role} })
                } else {
                    res.status(500).json({ message: 'Server error' })
                }
            }).catch(function (error) {
                res.status(400).json({ message: 'Bad request' });
            });
        }
    })
}



