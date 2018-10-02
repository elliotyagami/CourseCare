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
        res.redirect(`/${req.user._type}/dashboard`)
    } else {
        res.render('register', { role: req.params.role })
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



