var web = require('@mitter-io/web');
var getCookie = function(name) {
	var getCookieValues = function(cookie) {
		var cookieArray = cookie.split('=');
		return cookieArray[1].trim();
	};

	var getCookieNames = function(cookie) {
		var cookieArray = cookie.split('=');
		return cookieArray[0].trim();
	};

	var cookies = document.cookie.split(';');
	var cookieValue = cookies.map(getCookieValues)[cookies.map(getCookieNames).indexOf(name)];

	return (cookieValue === undefined) ? null : cookieValue;
};

let mitter;
function initialize(){
    mitter = web.Mitter.forWeb(
        getCookie("applicationId"),
        [function(){}],
        'https://api.mitter.io'
    )
    mitter.setUserAuthorization(getCookie('recipient'))
}
initialize()
let mitter_lib = {};

mitter.clients().channels().participatedChannels()
              .then(channels => console.log(channels))

global.mitter = mitter_lib

module.exports =  initialize
