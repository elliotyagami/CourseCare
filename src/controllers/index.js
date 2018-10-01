import {randomString, sha1passwordHasher} from './../helpers'
import {insertCookie, insertUser, ifUserPresent} from './../models'

export const register = (req, res) => {
	if (req.session.verfied) {
		res.redirect(`/${req.params.role}/dashboard`)
	} else {
		res.render('register', {role: req.params.role})
	}
}


export const registerUser = (req, res) => {
	let queryString, hashedpassword, saltedpassword;
	let salt = randomString()
	let trimedObject = {
		firstname: req.body.firstname.trim(),
		lastname: req.body.lastname.trim(),
		username: req.body.username.trim(),
        email: req.body.email.trim(),
        role: req.params.role,
		password: req.body.password.trim(),
        passwordCon: req.body.passwordCon.trim(),
        gender: req.body.gender
	}

	if (trimedObject.password == trimedObject.passwordCon){
	    saltedpassword = salt + req.body.password.trim()
    }
	else {
		res.status(400).json({message: 'password don\'t match.'})
		return;
	}

	hashedpassword = sha1passwordHasher(saltedpassword)
	trimedObject.hashedpassword = hashedpassword
	trimedObject.salt =salt
	insertUser(trimedObject,(err, result) => {
		if(err) {
			console.log(err)
		} else {
			res.render('register')
		}
	})
}

export const loginUser = (req, res) => {
	let saltedpassword, hashedpassword;
	ifUserPresent(req.body.email.trim(), (err, results) => {
		saltedpassword = results[0].salt + req.body.password.trim()
		hashedpassword = sha1passwordHasher(saltedpassword)
		if(hashedpassword == results[0].password){
			let generatedCookie = randomString()

			let d = new Date()
			d.setTime(d.getTime() + (3*24*60*60*1000));
			res.cookie('3dcookie', generatedCookie, { expire: d.toUTCString() })
			insertCookie({
				cookie: generatedCookie,
				email: req.body.email
			}, (err,result) => {
				if(err) {
					res.status(500).json({message: 'some error'})
				} else {
					res.redirect('/dashboard')
				}
			})
		}
		else {
			res.status(400).json({message: 'wrong credentials'});
		}

	})
}
