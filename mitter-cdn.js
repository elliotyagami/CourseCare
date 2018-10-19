var web = require('@mitter-io/web');
var isNewMessagePayload = require('@mitter-io/core').isNewMessagePayload;
let mitter;
function initialize() {
	mitter = web.Mitter.forWeb(
		getCookie('applicationId'),
		[function () { }],
		'https://api.mitter.io'
	)
	mitter.setUserAuthorization(getCookie('recipient'))

	mitter.subscribeToPayload((payload) => {
		if (isNewMessagePayload(payload)) {
			console.log(payload)
			console.log('payload')
			let senderId = payload.message.senderId.identifier
			let message = payload.message.textPayload
			let id = senderId.match(/\d+/g)[0]
			let ele = document.getElementById(senderId)
			if (!ele && parseInt(id) != parseInt(getCookie("UserId"))) {
				document.getElementById("labeluser-" + id).style.display = "inline-block"
				document.getElementById("labeluser-" + id).textContent = "1"
				if (document.getElementById(id) && document.getElementById(id).style.display != 'none') {
				} else {
					register_popup(id, senderId)
				}
				messenger("received", message, id)
			}
		}
	})
}

initialize()
let mitter_lib = {
	sendMessage: function (obj, msgText) {

		mitter.clients().messages()
			.sendMessage(obj.channelId, {
				senderId: mitter.me(),
				textPayload: msgText,
				timelineEvents: [
					{
						"type": "mitter.mtet.SentTime",
						"eventTimeMs": new Date().getTime(),
						"subject": obj.userId
					}
				]
			})
	},
	getChannelsList: function () {
		mitter.clients().channels().participatedChannels()
			.then(channels => console.log(channels))
	},
	getChannelMessages: function (obj, receiverId) {
		mitter.clients().messages().getMessages(obj.channelId).then(messages => {
			for (var i = messages.length - 1; i >= 0; i--)
				if (obj.userId == messages[i].senderId.identifier)
					messenger("sent", messages[i].textPayload, receiverId)
				else
					messenger("received", messages[i].textPayload, receiverId)
			// messages.forEach(function(message){
			// })
		})
	}
};


global.mitter = mitter_lib
