import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import exphbs from 'express-handlebars'
import session from 'express-session'
import ioCookieParser from 'socket.io-cookie-parser'
import passport from 'passport'
import {getCookie} from './src/helpers'
import models from './src/models'
import {channelClient} from './src/config/mitter'
// import routes from './src/routes'




//Sync Database
models.sequelize.sync().then(function() {
// models.sequelize.sync({force : true}).then(function() {

    console.log('Nice! Database looks fine')

}).catch(function(err) {

    console.log(err, "Something went wrong with the Database Update!")

});


let options = {
	dotfiles: 'ignore',
	index: false
}
// extensions: ['htm', 'html', 'css', 'js'],



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
	helpers: require("./src/helpers/handlebar-helper").helpers,
	layoutsDir: 'src/views/layouts',
	partialsDir: [
		'src/views/partials'
	]
}))


// app.use(expSession({
	// 	secret: 'anyStringOfText',
	// 	saveUnInitialized: true,
	// 	resave: true
	// }))

app.use(cookieParser())
var SequelizeStore = require('connect-session-sequelize')(session.Store);


app.use(session({
    secret: 'AsdfghjklpoiUytrEWQZXCvbnmLKJUiOPKJHGtrfdD_+)KKNCMKKD884615',
    saveUninitialized: true,
	resave: true,
	store: new SequelizeStore({
		db: models.sequelize
	})
}));
app.use(passport.initialize());
app.use(passport.session());


require('./src/config/passport.js')(models.User, passport);
require('./src/routes')(app,passport);



// app.use((req, res, next) => {
// 	console.log(req.session)
// 	if (req.cookies['3dcookie'] && req.session.verfied != true) {
// 		checkCookie(req.cookies['3dcookie'], (err, results) => {
// 			if (err) {
// 				console.log(err)
// 			}
// 			else if (results.length) {
// 				req.session.userId = results[0].user_id;
// 				req.session.username = results[0].username;
// 				req.session.verfied = true;
// 				console.log('cookie present')
// 			}
// 			next()
// 		})
// 	}
// 	else {
// 		next()
// 	}
// })

let server = app.listen(process.env.PORT || 3000, function () {
	let host = server.address().address
	let port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port)

})

let io = require("socket.io")(server, {})

function onConnection(socket){
	let cookies = socket.handshake.headers.cookie
	let room = "course#" + parseInt(getCookie("CourseId", cookies))
	let userId = parseInt(getCookie("UserId", cookies))


	socket.on('drawing', (data) => io.sockets.in(room).emit('drawing', data));
	socket.on('clear', (data) => io.sockets.in(room).emit('clear', data));
	socket.on('connectChat',(data)=> {

		let userId2 = parseInt(data.receiver)
		let min = userId < userId2 ? userId : userId2;
		let max = userId > userId2 ? userId : userId2;

		min = `user-${min}`
		max = `user-${max}`
		let channelId=`${min}@-@${max}`
		let obj = {
			"channelId": channelId,
			"defaultRuleSet": "io.mitter.ruleset.chats.DirectMessage",
			"participation": [
				{
					"participantId": min,
					"participationStatus": "Active"
				},
				{
					"participantId":  max,
					"participationStatus": "Active"
				}
			]
		}
		channelClient.getChannel(channelId).then(channelExist => {
			console.log(channelExist)
		}).catch(err => {
			console.log(err)
					channelClient.newChannel(obj).then(data =>{
						socket.emit('createdRoom',data)
					}).catch(err => {
							console.log(err)
					})
		})

	})
  }

io.on('connection', onConnection);




