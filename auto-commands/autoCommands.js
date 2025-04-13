const lightsInfo = (channel, tags, args, client) => {
	client.say(
		channel,
		'You can use your channel points at any time to change the color of the smart lighting during my stream!'
	)
}

const npChatbotInfo = (channel, tags, args, client) => {
	client.say(
		channel,
		'DJ streamers: learn more about adding the music discovery commands in my channel to your own with npChatbot.  You can also use it to create Spotify playlists of your live-streamed sets to share with your community. Check it out at www.npchatbot.com'
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
		'Commands you say?  Try one of these: !turnt, !smort, !jeep, !birb, !faded, !stuck, !cruise, !dadjoke, !rock, !paper, !scissors, !hey, !sunset, !nuts, !birdcam, !ye, !fact, !quote, !knows, !my'
	)
}

const birdInfo = (channel, tags, args, client) => {
	client.say(
		channel,
		'Check out what our feathered friends have been up to with the !birdcam command.'
	)
}

const dashInfo = (channel, tags, args, client) => {
	client.say(
		channel,
		'Say hello to Dash, my super camera-friendly squirrel buddy, any time with the !nuts command.'
	)
}

module.exports = {
	lightsInfo: lightsInfo,
	npChatbotInfo: npChatbotInfo,
	discordInfo: discordInfo,
	generalCommandInfo: generalCommandInfo,
	birdInfo: birdInfo,
	dashInfo: dashInfo,
}
