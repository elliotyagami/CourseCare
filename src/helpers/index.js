import crypto from 'crypto'
import bcrypt from 'bcryptjs'


export const escapeString = (string) => {
	return string.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')
}


export const createHashedPassword = (password) => {
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(password, salt);
	return hash
}
