import models from './../models'

export const addCourseTemplate = (req, res) => {
    if (req.isAuthenticated() && req.user.role ==  "tutor") {
        // res.redirect(`/${req.user.type}/whiteboard`)
        res.render("xhr",{userData: req.user, type: 'add-course', layout: 'empty.handlebars'})
    } else {
        res.render("")
    }
}


export const registerCourseTemplate = (req, res) => {
    if (req.isAuthenticated() && req.user.role ==  "student") {
        // res.redirect(`/${req.user.type}/whiteboard`)
        res.render("xhr",{userData: req.user, type: 'register-course', layout: 'empty.handlebars', courseId: req.params.id})
    } else {
        res.render("")
    }
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

export const courseListTemplate = (req, res) => {
    if (req.isAuthenticated() && req.user.role == "tutor") {
        models.Course.findAll({
            attributes: ['title', 'description', 'createdAt', 'id', 'password'],
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
            } else {
                res.status(401).json({ message: "authorization failed" })
            }
        }).catch(function (err) {
            console.log(err)
        })

    } else {
        res.redirect(`/${req.params.role}/profile`)
    }
}
