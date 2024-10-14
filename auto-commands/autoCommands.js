const lightsInfo = (channel, tags, args, client) => {
	client.say(
		channel,
		'You can control my smart lighting by entering !lights and any of the following options: on, off, random, morph, green, blue, red, purple, pink, teal, gold, peach '
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
