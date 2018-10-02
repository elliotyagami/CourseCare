import { randomString, sha1passwordHasher, createHashedPassword } from './../helpers'
import { insertCookie, insertUser, ifUserPresent } from './../models'
import models from './../models'

export const dashboard = (req, res) => {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated() ) {
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

export const whiteboard = (req, res) => {
    if (req.isAuthenticated()) {
        // res.redirect(`/${req.user.type}/whiteboard`)
        res.render("xhr-whiteboard",{role: req.user.role, layout: 'empty.handlebars'})
    } else {
        res.render("")
    }
}

export const profile = (req, res) => {
    if (req.isAuthenticated()) {
        // res.redirect(`/${req.user.type}/whiteboard`)
        res.render("profile",{role: req.user.role})
    } else {
        res.redirect(`/${req.params.role}/register`)
    }
}

export const discussion = (req, res) => {
    if (req.isAuthenticated()) {
        // res.redirect(`/${req.user.type}/whiteboard`)
        res.render("xhr-discussion",{layout: 'empty.handlebars', "posts": [
            {
                "authorpic": "/images/avatar/jenny.jpg",
                "authorname": "Jenny",
                "title": "Random text",
                "time": "3 days ago",
                "description": "Ours is a life of constant reruns. We're always circling back to where we'd we started, then starting all over again. Even if we don't run extra laps that day, we surely will come back for more of the same another day soon.",
                "likecount": "5",
                "comments": [
                    {
                        "author": "Matt",
                        "pic": "/images/avatar/matthew.png",
                        "text": "How artistic!",
                        "time": "Today at 5:42PM",
                        "comments": [
                            {
                                "author": "Elliot Fu",
                                "pic": "/images/avatar/matthew.png",
                                "text": "This has been very useful for my research. Thanks as well!",
                                "time": "Yesterday at 12:30AM",
                                "comments" : []
                            }
                        ]
                    },
                    {
                        "author": "Matt",
                        "pic": "/images/avatar/matthew.png",
                        "text": "How artistic!",
                        "time": "Today at 5:42PM",
                        "comments" : []
                    }
                ]
            }
        ]})
    } else {
        res.render("")
    }
}


export const registerUser = (req, res) => {
    models.user.findOne({
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
                gender: req.body.gender
            }

            if (req.body.password == req.body.passwordCon) {
            }
            else {
                res.status(400).json({ message: 'password don\'t match.' })
                return
            }

            models.user.create(trimedObject).then(function (newUser, created) {
                if (newUser) {
                    // res.status(201).json({ message: 'User created' })
                    res.render('register', { role: req.params.role })
                }else {
                    res.status(500).json({ message: 'Server error' })
                }
            })
        }
    })
}

export const loginUser = (req, res) => {
    let saltedpassword, hashedpassword;
    ifUserPresent(req.body.email.trim(), (err, results) => {
        saltedpassword = results[0].salt + req.body.password.trim()
        hashedpassword = sha1passwordHasher(saltedpassword)
        if (hashedpassword == results[0].password) {
            let generatedCookie = randomString()

            let d = new Date()
            d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
            res.cookie('3dcookie', generatedCookie, { expire: d.toUTCString() })
            insertCookie({
                cookie: generatedCookie,
                email: req.body.email
            }, (err, result) => {
                if (err) {
                    res.status(500).json({ message: 'some error' })
                } else {
                    res.redirect('/dashboard')
                }
            })
        }
        else {
            res.status(400).json({ message: 'wrong credentials' });
        }

    })
}



