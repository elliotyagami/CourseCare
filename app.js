import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import shell from 'shelljs'
import Hashes from 'jshashes'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import exphbs from 'express-handlebars'
import expSession from 'express-session'
import ioCookieParser from 'socket.io-cookie-parser'

import routes from './src/routes'
import { checkCookie, insertSong, songHistory, historyOfPresentSong} from './src/models'
import { md5songHasher, escapeString } from './src/helpers'

let MD5 = new Hashes.MD5
let options = {
	dotfiles: 'ignore',
	extensions: ['htm', 'html'],
	index: false
}



let app = express()
app.use(morgan('combined'))

app.use(express.static(path.join(__dirname, 'public'),
	options))
app.use(bodyParser.urlencoded({
	extended: true
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, '/src/views'))
app.engine('handlebars', exphbs({
	defaultLayout: 'index',
	layoutsDir: 'src/views/layouts',
	partialsDir: [
		'src/views/partials'
	]
}))
app.use(expSession({
	secret: 'anyStringOfText',
	saveUnInitialized: true,
	resave: true
}))
app.use(cookieParser())
app.use((req, res, next) => {
	console.log(req.session)
	if (req.cookies['3dcookie'] && req.session.verfied != true) {
		checkCookie(req.cookies['3dcookie'], (err, results) => {
			if (err) {
				console.log(err)
			}
			else if (results.length) {
				req.session.userId = results[0].user_id;
				req.session.username = results[0].username;
				req.session.verfied = true;
				console.log('cookie present')
			}
			next()
		})
	}
	else {
		next()
	}
})
app.use('/', routes)

let server = app.listen(process.env.PORT || 3000, function () {
	let host = server.address().address
	let port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port)

})

let io = require("socket.io")(server, {})
io.use(ioCookieParser());




io.sockets.on("connection", function (socket) {
	socket.on('youtube-url', async function (url) {
		let name = md5songHasher(url)
		let cookie = socket.request.cookies['3dcookie']
		if (cookie) {
			let nameFetcher = `youtube-dl --get-description '${url}' |grep -A1 '^$' | head -2`
			shell.exec(nameFetcher, (code, stdout, stderr) => {
				insertSong({ url: url, song_name: escapeString(stdout.trim())}, (err, result) => {
					if (!err || err.code == 'ER_DUP_ENTRY') {
						songHistory({ url: url, cookie: cookie }, (err, result) => {
							console.log('stored')
						})
					}
				})

			})
		}
		await shell.exec(`./script.sh ${url} ${name}`)
		socket.emit("done", name)
	})
	socket.on('watching', (songId) => {
		let cookie = socket.request.cookies['3dcookie']
		if (cookie) {
			historyOfPresentSong({ songId: songId, cookie: cookie }, (err, result) => {
				console.log('stored')
			})
		}
	})
	socket.on('favorite', function (hash) {
	})
	socket.on('upvote', function (hash) {
	})
})
