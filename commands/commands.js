const dotenv = require('dotenv')
dotenv.config()

// helper method to generate a random value between 1 and 100
const randomValue = () => {
	return Math.floor(Math.random() * 100) + 1
}

// social media and link commands

const discordCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`Join the MCB community for more tunes, tech, squirrels, and playlists from past Twitch streams over on Discord: https://discord.gg/YCUGhxyRJR`
	)
}

const linksCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can find all of my socials & links @ https://www.djmarcusmcbride.com`
	)
}

const vinylCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`Wanna dig through my record collection?  You can check out some of my favorite remixes and throwbacks over on TikTok @ www.tiktok.com/@djmarcusmcb `
	)
}

const scCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can check out MarcusMCB's Soundcloud page over @ https://soundcloud.com/marcusmcbride.`
	)
}

const mixesCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can check out my mixes on MixCloud over @ https://www.mixcloud.com/marcusmcbride`
	)
}

const primeCommand = (channel, tags, args, client) => {
	const channelName = channel.slice(1).split('#')
	client.say(
		channel,
		`Got Amazon Prime? If you do, you can use your free Prime subscription to support my channel! subs.twitch.tv/${channelName}`
	)
}

const codeCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		'You can find streaming tools for Twitch, Discord, Twitter, plus a lot of other fun tech stuff over on my Github page! https://www.github.com/marcusmcb'
	)
}

const npChatbotLinkCommand = (channel, tags, args, client, obs) => {
	client.say(
		channel,
		`DJs ---> you can add the music discovery commands and features from my channel to your own with npChatbot.  Learn more about the app and try out the free download over at https://www.npchatbot.com`
	)
}

const cratestatsCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		"DJs - Want to learn more about your last set?  Check out https://www.cratestats.com to learn more about data analytics for DJs (and beta testing if you're up for it!)"
	)
}

// static / utility commands
const listCommands = (channel, tags, args, client) => {
	client.say(
		channel,
		"You can check out this channel's chat command list here: marcusmcb.github.io/twitch-chat-commands"
	)
}

const raidCommand = (channel, tags, args, client, obs) => {
	client.say(
		channel,
		`TombRaid TombRaid 🎉🎉 DJMarcusMCB just rolled up with a raid! 🎉🎉 TombRaid TombRaid`
	)
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

const areacodeCommand = (channel, tags, args, client) => {
	const channelName = channel.slice(1).split('#')
	client.say(
		channel,
		`${channelName} is coming to you live from the front of the crib in Orange County, CA! 🍊`
	)
}

const hugCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`${tags.username} sends a big digital hug to ${args} VirtualHug`
	)
}

const portexCommand = (channel, tags, args, client) => {
	client.say(channel, 'OH look what time it is! 🥃🥃🥃')
}

const cansCommand = (channel, tags, args, client) => {
	client.say(channel, 'Headphones ON for this one! 🎧🎧🎧')
}

const yyCommand = (channel, tags, args, client) => {
	client.say(channel, "YEAH Y'ARE! 💯")
}

const gsdCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`@${tags.username} is getting sh*t *done* right now! 💪💪💪`
	)
}

const playlistsCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can check out all of the playlists from my past Twitch streams over on Spotify @ https://open.spotify.com/user/1248412141/playlists`
	)
}

const noMicCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`@djmarcusmcb is currently recording this mix. If you hear him on the mic, it means he's between sets (or he tanked a transition!)`
	)
}

const skidaddleCommand = (channel, tags, args, client) => {
	if (args.length === 0) {
		client.say(
			channel,
			`Hey, guess what, folks?  That's the news and @${tags.username} is outta here! ✏️🏃💨`
		)
	} else {
		client.say(
			channel,
			`Hey, guess what, folks?  That's the news and ${args} is outta here! ✏️🏃💨`
		)
	}
}

const beefcakeCommand = (channel, tags, args, client) => {
	if (args.length === 0) {
		client.say(channel, 'FOLLOW YOUR DREAMS! 💪💪💪')
	} else {
		client.say(channel, `FOLLOW YOUR DREAMS, ${args}! 💪💪💪`)
	}
}

const respekCommand = (channel, tags, args, client) => {
	if (args.length === 0) {
		client.say(channel, `Respek to you, @${tags.username}! 👑👑👑`)
	} else {
		client.say(channel, `Put some respek on ${args}'s name! 👑👑👑`)
	}
}

const portCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`@${tags.username} is pouring up that shot right about now! 🥃🥃🥃`
	)
}

const knowsCommand = (channel, tags, args, client) => {
	if (args.length === 0) {
		client.say(channel, `@${tags.username} knows a guy... 🔨`)
	} else {
		client.say(channel, `${args} knows knows a guy... 🔨`)
	}
}

const cakeCommand = (channel, tags, args, client) => {
	if (args.length === 0) {
		client.say(channel, `@${tags.username} has that slice ready! 🎂🎂🎂`)
	} else {
		client.say(
			channel,
			`@${tags.username} has a slice ready for ${args}! 🎂🎂🎂`
		)
	}
}

// admin & moderator commands

const shoutOutCommand = (channel, tags, args, client, obs) => {
	if (args.length === 0) {
		client.say(channel, `Uhh... who should I shout out here? 📣📣📣`)
	} else {
		let argsParsed = args[0].slice(1)
		if (tags.username === `${process.env.TWITCH_CHANNEL_NAME}` || tags.mod) {
			client.say(
				channel,
				`Be sure to follow our good friend ${args}'s channel here on Twitch! www.twitch.tv/${argsParsed} `
			)
		}
	}
}

const bitsCommand = (channel, tags, args, client) => {
	if (args.length === 0) {
		return
	} else {
		let argsParsed = args[0].slice(1)
		if (tags.username === `${process.env.TWITCH_CHANNEL_NAME}` || tags.mod) {
			client.say(
				channel,
				`${argsParsed}, thank you so much for the BITS fam! 🎉🎉🎉`
			)
		}
	}
}

// commands with random number generated values

const postCommand = (channel, tags, args, client) => {
	let postValue = randomValue()
	client.say(channel, `That talk up was ${postValue}% on the nose! 🎧`)
}

const fadedCommand = (channel, tags, args, client) => {
	const fadedResult = randomValue()
	if (args.length === 0) {
		client.say(
			channel,
			`@${tags.username} is ${fadedResult}% faded right now. 😎😎😎`
		)
	} else {
		client.say(channel, `${args} is ${fadedResult}% faded right now. 😎😎😎`)
	}
}

const smortCommand = (channel, tags, args, client) => {
	let smortValue = randomValue()
	if (args.length === 0) {
		client.say(channel, `@${tags.username} is ${smortValue}% SMORT! 🧠🧠🧠`)
	} else {
		client.say(channel, `${args} is ${smortValue}% SMORT! 🧠🧠🧠`)
	}
}

const burntCommand = (channel, tags, args, client) => {
	let burntValue = randomValue()
	if (args.length === 0) {
		client.say(channel, `@${tags.username} is ${burntValue}% burnt right now!`)
	} else {
		client.say(channel, `${args} is ${burntValue}% burnt right now!`)
	}
}

const floatyCommand = (channel, tags, args, client) => {
	let floatyValue = randomValue()
	if (args.length === 0) {
		client.say(
			channel,
			`@${tags.username} is ${floatyValue}% floaty right now! 🤪🤪🤪`
		)
	} else {
		client.say(channel, `${args} is ${floatyValue}% floaty right now! 🤪🤪🤪`)
	}
}

const turntCommand = (channel, tags, args, client) => {
	let turntValue = randomValue()
	if (args.length === 0) {
		client.say(
			channel,
			`@${tags.username} is ${turntValue}% turnt right now! 🎉🎉🎉`
		)
	} else {
		client.say(channel, `${args} is ${turntValue}% turnt right now! 🎉🎉🎉`)
	}
}

const dingusCommand = (channel, tags, args, client) => {
	let dingusValue = randomValue()
	if (args.length === 0) {
		client.say(
			channel,
			`@${tags.username} is ${dingusValue}% dingus right now! 🤪🤪🤪`
		)
	} else {
		client.say(channel, `${args} is ${dingusValue}% dingus right now! 🤪🤪🤪`)
	}
}

const highCommand = (channel, tags, args, client) => {
	let highValue = randomValue()
	if (args.length === 0) {
		client.say(
			channel,
			`@${tags.username} is ${highValue}% high right now! 🎉🎉🎉`
		)
	} else {
		client.say(channel, `${args} is ${highValue}% high right now! 🎉🎉🎉`)
	}
}

const litCommand = (channel, tags, args, client) => {
	let litValue = randomValue()
	if (args.length === 0) {
		client.say(
			channel,
			`@${tags.username} is ${litValue}% lit right now! 🎉🎉🎉`
		)
	} else {
		client.say(channel, `${args} is ${litValue}% lit right now! 🎉🎉🎉`)
	}
}

const borkedCommand = (channel, tags, args, client) => {
	let borkedValue = randomValue()
	if (args.length === 0) {
		client.say(
			channel,
			`@${tags.username} is ${borkedValue}% borked right now! 💀💀💀`
		)
	} else {
		client.say(channel, `${args} is ${borkedValue}% borked right now! 💀💀💀`)
	}
}

const guttercheckCommand = (channel, tags, args, client) => {
	let guttercheckValue = randomValue()
	if (args.length === 0) {
		client.say(
			channel,
			`@${tags.username} better go check their gutters because they're ${guttercheckValue}% loose right right now! 🎉🎉🎉`
		)
	} else {
		client.say(
			channel,
			`${args} better go check their gutters because they're ${guttercheckValue}% loose right now! 🎉🎉🎉`
		)
	}
}

const stuffedCommand = (channel, tags, args, client) => {
	console.log('*** HERE ***')
	let stuffedValue = Math.floor(Math.random() * 1000) + 2
	if (args.length === 0) {
		client.say(channel, `@${tags.username} is ${stuffedValue}% stuffed! 🦃🦃🦃`)
	} else {
		client.say(channel, `${args} is ${stuffedValue}% stuffed! 🦃🦃🦃`)
	}
}

// game commands

const diceCommand = (channel, tags, args, client) => {
	const result = Math.floor(Math.random() * 6) + 1
	client.say(channel, `@${tags.username}, you rolled a ${result}. 🎲🎲🎲`)
}

// user created commands

const greerCityCommand = (channel, tags, args, client) => {
	client.say(channel, `Where the NASCAR fans turn left but vote right.`)
}

const ericCommand = (channel, tags, args, client) => {
	client.say(channel, `Happy Birthday, @Cynsaytional! 🎉🎉🎉`)
}

// const tonightCommand = (channel, tags, args, client) => {
// 	client.say(
// 		channel,
// 		`We're celebrating my 1st Twitch Affiliate Anniversary tonight by giving away some really cool MCB merch!  If you're a follower/subscriber, simply message me with your mailing address.  I'll be sending you a few goodies this week as a thank you for being part of the community! 🎉🎉🎉`
// 	)
// }

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
	listCommands: listCommands,
	burntCommand: burntCommand,
	mixesCommand: mixesCommand,
	vinylCommand: vinylCommand,
	hugCommand: hugCommand,
	floatyCommand: floatyCommand,
	postCommand: postCommand,
	stuffedCommand: stuffedCommand,
	gsdCommand: gsdCommand,
	turntCommand: turntCommand,
	noMicCommand: noMicCommand,
	cakeCommand: cakeCommand,
	raidCommand: raidCommand,
	bitsCommand: bitsCommand,
	ericCommand: ericCommand,
	guttercheckCommand: guttercheckCommand,
	cansCommand: cansCommand,
	knowsCommand: knowsCommand,
	discordCommand: discordCommand,
	// tonightCommand: tonightCommand,
	litCommand: litCommand,
	highCommand: highCommand,
	borkedCommand: borkedCommand,
	respekCommand: respekCommand,
	npChatbotLinkCommand: npChatbotLinkCommand,
	yyCommand: yyCommand,
	greerCityCommand: greerCityCommand,
	portCommand: portCommand,
	skidaddleCommand: skidaddleCommand,
	beefcakeCommand: beefcakeCommand,
	portexCommand: portexCommand,
	playlistsCommand: playlistsCommand,
	dingusCommand: dingusCommand,
}

// refactor random number generated values
// into single helper method
