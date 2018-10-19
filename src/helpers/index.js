import bcrypt from 'bcryptjs'

export const randomString = () => {
	return Math.random().toString().substr(2)
}

export const createHashedPassword = (password) => {
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(password, salt);
	return hash
}

export const getPicture = (gender) => {
	let maleImg = ['elliot.jpg', 'matthew.png', 'steve.jpg']
	let femaleImg = ['jenny.jpg', 'lindsay.png', 'rachel.jpg', 'veronika.jpg']
	if (gender == 'female'){
		maleImg = femaleImg;
	}
	let ind = Math.floor(Math.random()*maleImg.length);
	return '/images/avatar/'+maleImg[ind]
}


export const getCookie = function(name, doc =null) {
	var getCookieValues = function(cookie) {
		var cookieArray = cookie.split('=');
		return cookieArray[1].trim();
	};

	var getCookieNames = function(cookie) {
		var cookieArray = cookie.split('=');
		return cookieArray[0].trim();
	};

	var cookies;
	if (! doc){
		cookies = document.cookie.split(';');
	}else{
		cookies = doc.split(';');
	}
	var cookieValue = cookies.map(getCookieValues)[cookies.map(getCookieNames).indexOf(name)];

	return (cookieValue === undefined) ? null : cookieValue;
};
