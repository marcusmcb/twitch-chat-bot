const lightsInfo = (channel, tags, args, client) => {
	client.say(
		channel,
		'You can use your channel points at any time to change the color of the smart lighting during my stream!'
	)
}

const npChatbotInfo = (channel, tags, args, client) => {
	client.say(
		channel,
		'DJ streamers: learn more about adding the "now playing" and "did you play?" commands in my channel to your own with npChatbot.  Check it out at www.npchatbot.com'
	)
}

module.exports = {
	lightsInfo: lightsInfo,
	npChatbotInfo: npChatbotInfo,
}
