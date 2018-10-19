import express from 'express'


let router = express.Router()

router.get('/register', (req, res) => {
	if (req.session.verfied) {
		if (req.params.hash) {
			res.render('main', { songUrl: `${req.params.hash}`, songId: `${req.params.id}`})
		} else {
			res.render('main', { songUrl: ``})
		}
	} else {
        res.status(403).json({message: `not logged in <a href='/register'>register first</a>`})

	}
})

export default router
