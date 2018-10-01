import crypto from 'crypto'

export const randomString = () => {
	return crypto.randomBytes(50).toString('hex').slice(0,50)
}

export const sha1passwordHasher = (saltedpassword) => {
	return crypto.createHash('sha1').update(saltedpassword).digest("hex")
}

export const md5songHasher = (songUrl) => {
	return crypto.createHash('md5').update(songUrl).digest("hex")
}

export const escapeString = (string) => {
	return string.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')
}
