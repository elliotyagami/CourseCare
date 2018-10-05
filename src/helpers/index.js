import bcrypt from 'bcryptjs'

export const randomString = () => {
	return Math.random().toString().substr(2)
}

export const createHashedPassword = (password) => {
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(password, salt);
	return hash
}
