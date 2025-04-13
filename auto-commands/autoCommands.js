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

const discordInfo = (channel, tags, args, client) => {
	client.say(
		channel,
		`Join the MCB community for more tunes, tech, squirrels, and playlists from past Twitch streams over on Discord: https://discord.gg/YCUGhxyRJR`
	)
}

const generalCommandInfo = (channel, tags, args, client) => {
	client.say(
		channel,
		'Commands you say?  Try one of these: !turnt, !smort, !jeep, !birb, !faded, !stuck, !cruise, !dadjoke, !rock, !paper, !scissors, !hey, !sunset, !nuts, !birdcam'
	)
}

module.exports = {
	lightsInfo: lightsInfo,
	npChatbotInfo: npChatbotInfo,
	discordInfo: discordInfo,
	generalCommandInfo: generalCommandInfo,
}
