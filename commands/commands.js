const dotenv = require('dotenv')
dotenv.config()

const shoutOutCommand = (channel, tags, args, client, obs) => {	
	let argsParsed = args[0].slice(1)	
	if (tags.username === `${process.env.TWITCH_CHANNEL_NAME}` || tags.mod) {
		client.say(
			channel,
			`Be sure to follow ${args}'s channel here on Twitch: www.twitch.tv/${argsParsed} `
		)
	}
}

const helloCommand = (channel, tags, args, client, obs) => {
	client.say(
		channel,
		`@${process.env.TWITCH_CHANNEL_NAME}, what's good homie! 👋👋👋`
	)
}

const lurkCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`@${tags.username} is gonna be over there, doin' whatever...`
	)
}

const backCommand = (channel, tags, args, client) => {
	client.say(channel, `Lurk no more... @${tags.username} has returned!`)
}

const fadedCommand = (channel, tags, args, client) => {
	const fadedResult = Math.floor(Math.random() * 100) + 1
	client.say(channel, `@${tags.username} is ${fadedResult}% faded right now.`)
}

const linksCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can find all of my socials & links @ http://www.djmarcusmcbride.com`
	)
}

const cratestatsCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		'DJs - Want to learn more about what you actually did during your last DJ set?  Check out http://www.cratestats.com to learn more about data analytics for DJs.'
	)
}
const areacodeCommand = (channel, tags, args, client) => {
	const channelName = channel.slice(1).split('#')
	client.say(
		channel,
		`${channelName} is coming to you live from the front of the crib in Orange County, CA! 🍊`
	)
}
const scCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can check out MarcusMCB's Soundcloud page over @ https://soundcloud.com/marcusmcbride.`
	)
}

const primeCommand = (channel, tags, args, client) => {
	const channelName = channel.slice(1).split('#')
	client.say(
		channel,
		`Got Amazon Prime? Subscribe to the channel for free! https://subs.twitch.tv/${channelName}`
	)
}

const codeCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		'Streaming tools for Twitch, Twitter & more: https://github.com/marcusmcb'
	)
}

const diceCommand = (channel, tags, args, client) => {
	const result = Math.floor(Math.random() * 6) + 1
	client.say(channel, `@${tags.username}, you rolled a ${result}. 🎲🎲🎲`)
}

const smortCommand = (channel, tags, args, client) => {
	let smortValue = Math.floor(Math.random() * 101)
	client.say(channel, `@${tags.username} is ${smortValue}% SMORT!`)
}

module.exports = {
	helloCommand: helloCommand,
	lurkCommand: lurkCommand,
	backCommand: backCommand,
	fadedCommand: fadedCommand,
	linksCommand: linksCommand,
	cratestatsCommand: cratestatsCommand,
	areacodeCommand: areacodeCommand,
	scCommand: scCommand,
	primeCommand: primeCommand,
	codeCommand: codeCommand,
	diceCommand: diceCommand,
	smortCommand: smortCommand,
	shoutOutCommand: shoutOutCommand,
}
