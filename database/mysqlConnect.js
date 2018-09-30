import mysql from 'mysql'
import { hostname, username, secret, database } from './../../config/config'

let connection = mysql.createConnection({
	host: hostname,
	user: username,
	password: secret,
	database: database
});
connection.connect();

export default connection
