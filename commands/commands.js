const dotenv = require('dotenv')
dotenv.config()

const sharedBirthdayCelebrities = require('./bday/sharedBirthdayCelebrities')

// helper method to generate a random value between 1 and 100
const randomValue = () => {
	return Math.floor(Math.random() * 100) + 1
}

const randomItem = (items) => {
	const index = Math.floor(Math.random() * items.length)
	return items[index]
}

let availableSharedBirthdayCelebrities = [...sharedBirthdayCelebrities]

const randomSharedBirthdayCelebrity = () => {
	if (availableSharedBirthdayCelebrities.length === 0) {
		availableSharedBirthdayCelebrities = [...sharedBirthdayCelebrities]
	}

	const selectedCelebrity = randomItem(availableSharedBirthdayCelebrities)
	availableSharedBirthdayCelebrities =
		availableSharedBirthdayCelebrities.filter(
			(celebrity) => celebrity !== selectedCelebrity,
		)

	return selectedCelebrity
}

const getMCBAgeRelation = (relation) => {
	if (relation === 'older') {
		return 'younger'
	}

	if (relation === 'younger') {
		return 'older'
	}

	return relation
}

const birthdayMessageTemplates = [
	({ yearsDifference, relation, name, notableThing }) =>
		`Congrats, MCB! You're ${yearsDifference} years ${getMCBAgeRelation(relation)} than ${name}, best known for ${notableThing}, who shares a birthday with you today! 🎉🎉🎉`,
	({ yearsDifference, relation, name, notableThing }) =>
		`Birthday fun fact for the chat: MCB is ${yearsDifference} years ${getMCBAgeRelation(relation)} than ${name}, the legend behind ${notableThing}. 🎂`,
	({ yearsDifference, relation, name, notableThing }) =>
		`March 29th crew check: MCB is ${yearsDifference} years ${getMCBAgeRelation(relation)} than ${name}, best known for ${notableThing}. Pretty good birthday company, honestly. 🎉`,
	({ yearsDifference, relation, name, notableThing }) =>
		`As of today, MCB is ${yearsDifference} years ${getMCBAgeRelation(relation)} than ${name}, famous for ${notableThing}. Not a bad group to be in at all. 🥳`,
]

const formatBirthdayMessage = (celebrity) => {
	const template = randomItem(birthdayMessageTemplates)
	return template(celebrity)
}

// social media and link commands

const discordCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`Join the MCB community for more tunes, tech, squirrels, and playlists from past Twitch streams over on Discord: https://discord.gg/YCUGhxyRJR`,
	)
}

const linksCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can find all of my socials & links @ https://www.djmarcusmcbride.com`,
	)
}

const vinylCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`Wanna dig through my record collection?  You can check out some of my favorite remixes and throwbacks over on TikTok @ www.tiktok.com/@djmarcusmcb `,
	)
}

const scCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can check out MarcusMCB's Soundcloud page over @ https://soundcloud.com/marcusmcbride.`,
	)
}

const mixesCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can check out my mixes on MixCloud over @ https://www.mixcloud.com/marcusmcbride`,
	)
}

const primeCommand = (channel, tags, args, client) => {
	const channelName = channel.slice(1).split('#')
	client.say(
		channel,
		`Got Amazon Prime? If you do, you can use your free Prime subscription to support my channel! subs.twitch.tv/${channelName}`,
	)
}

const codeCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		'You can find streaming tools for Twitch, Discord, Twitter, plus a lot of other fun tech stuff over on my Github page! https://www.github.com/marcusmcb',
	)
}

const npChatbotLinkCommand = (channel, tags, args, client, obs) => {
	client.say(
		channel,
		`DJs ---> you can add the music discovery commands and features from my channel to your own with npChatbot.  Learn more about the app and try out the free download over at https://www.npchatbot.com`,
	)
}

const cratestatsCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		"DJs - Want to learn more about your last set?  Check out https://www.cratestats.com to learn more about data analytics for DJs (and beta testing if you're up for it!)",
	)
}

// static / utility commands
const listCommands = (channel, tags, args, client) => {
	client.say(
		channel,
		"You can check out this channel's chat command list here: marcusmcb.github.io/twitch-chat-commands",
	)
}

const raidCommand = (channel, tags, args, client, obs) => {
	client.say(
		channel,
		`TombRaid TombRaid 🎉🎉 DJMarcusMCB just rolled up with a raid! 🎉🎉 TombRaid TombRaid`,
	)
}

const helloCommand = (channel, tags, args, client, obs) => {
	client.say(
		channel,
		`@${process.env.TWITCH_CHANNEL_NAME}, what's good homie! 👋👋👋`,
	)
}

const lurkCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`@${tags.username} is gonna be over there, doin' whatever...`,
	)
}

const backCommand = (channel, tags, args, client) => {
	client.say(channel, `Lurk no more... @${tags.username} has returned!`)
}

const areacodeCommand = (channel, tags, args, client) => {
	const channelName = channel.slice(1).split('#')
	client.say(
		channel,
		`${channelName} is coming to you live from the front of the crib in Orange County, CA! 🍊`,
	)
}

const hugCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`${tags.username} sends a big digital hug to ${args} VirtualHug`,
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
		`@${tags.username} is getting sh*t *done* right now! 💪💪💪`,
	)
}

const playlistsCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can check out all of the playlists from my past Twitch streams over on Spotify @ https://open.spotify.com/user/1248412141/playlists`,
	)
}

const archiveCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`Want to listen to some classic, late night radio mixshows?  You can listen to all of mine any time you like over at https://www.mcbarchives.com 🎧`,
	)
}

const youtubeCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can listen to DJ sets I've recorded and watch replays of my past Twitch streams over on my YouTube channel @ https://www.youtube.com/@marcusmcb`,
	)
}

const noMicCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`@djmarcusmcb is currently recording this mix. If you hear him on the mic, it means he's between sets (or he tanked a transition!)`,
	)
}

const skidaddleCommand = (channel, tags, args, client) => {
	if (args.length === 0) {
		client.say(
			channel,
			`Hey, guess what, folks?  That's the news and @${tags.username} is outta here! ✏️🏃💨`,
		)
	} else {
		client.say(
			channel,
			`Hey, guess what, folks?  That's the news and ${args} is outta here! ✏️🏃💨`,
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
		`@${tags.username} is pouring up that shot right about now! 🥃🥃🥃`,
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
			`@${tags.username} has a slice ready for ${args}! 🎂🎂🎂`,
		)
	}
}

const dangerCommand = (channel, tags, args, client) => {
	client.say(channel, `SAFETY THIRD! 🔥🔥🔥`)
}

const warningCommand = (channel, tags, args, client) => {
	client.say(channel, `DANGER MCB, DANGER! 🤖🤖🤖`)
}

const bitsCommand = (channel, tags, args, client) => {
	if (args.length === 0) {
		return
	} else {
		let argsParsed = args[0].slice(1)
		if (tags.username === `${process.env.TWITCH_CHANNEL_NAME}` || tags.mod) {
			client.say(
				channel,
				`${argsParsed}, thank you so much for the BITS fam! 🎉🎉🎉`,
			)
		}
	}
}

// birthday commands
const bdayCommand = (channel, tags, args, client) => {
	const birthdayCelebrity = randomSharedBirthdayCelebrity()
	client.say(channel, formatBirthdayMessage(birthdayCelebrity))
}

const shoutOutCommand = (channel, tags, args, client, obs) => {
	if (args.length === 0) {
		client.say(channel, `Uhh... who should I shout out here? 📣📣📣`)
	} else {
		let argsParsed = args[0].slice(1)
		if (tags.username === `${process.env.TWITCH_CHANNEL_NAME}` || tags.mod) {
			client.say(
				channel,
				`Be sure to follow our good friend ${args}'s channel here on Twitch! www.twitch.tv/${argsParsed} `,
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
			`@${tags.username} is ${fadedResult}% faded right now. 😎😎😎`,
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
			`@${tags.username} is ${floatyValue}% floaty right now! 🤪🤪🤪`,
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
			`@${tags.username} is ${turntValue}% turnt right now! 🎉🎉🎉`,
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
			`@${tags.username} is ${dingusValue}% dingus right now! 🤪🤪🤪`,
		)
	} else {
		client.say(channel, `${args} is ${dingusValue}% dingus right now! 🤪🤪🤪`)
	}
}

const brainrotCommand = (channel, tags, args, client) => {
	let brainrotValue = randomValue()
	if (args.length === 0) {
		client.say(
			channel,
			`@${tags.username} has ${brainrotValue}% brainrot right now! 🤪🤪🤪`,
		)
	} else {
		client.say(
			channel,
			`${args} has ${brainrotValue}% brainrot right now! 🤪🤪🤪`,
		)
	}
}

const highCommand = (channel, tags, args, client) => {
	let highValue = randomValue()
	if (args.length === 0) {
		client.say(
			channel,
			`@${tags.username} is ${highValue}% high right now! 🎉🎉🎉`,
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
			`@${tags.username} is ${litValue}% lit right now! 🎉🎉🎉`,
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
			`@${tags.username} is ${borkedValue}% borked right now! 💀💀💀`,
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
			`@${tags.username} better go check their gutters because they're ${guttercheckValue}% loose right right now! 🎉🎉🎉`,
		)
	} else {
		client.say(
			channel,
			`${args} better go check their gutters because they're ${guttercheckValue}% loose right now! 🎉🎉🎉`,
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

const risenCommand = (channel, tags, args, client) => {
	let risenValue = randomValue()
	if (args.length === 0) {
		client.say(
			channel,
			`@${tags.username} is ${risenValue}% RISEN right now! 🌅🌅🌅`,
		)
	} else {
		client.say(channel, `${args} is ${risenValue}% RISEN right now! 🌅🌅🌅`)
	}
}

// game commands

const diceCommand = (channel, tags, args, client) => {
	const result = Math.floor(Math.random() * 6) + 1
	client.say(channel, `@${tags.username}, you rolled a ${result}. 🎲🎲🎲`)
}

const pluribusCommand = (channel, tags, args, client) => {
	let pluribusValue = randomValue()
	if (args.length === 0) {
		client.say(
			channel,
			`@${tags.username} is ${pluribusValue}% connected to the hivemind right now! 🤖🤖🤖`,
		)
	} else {
		client.say(
			channel,
			`${args} is ${pluribusValue}% connected to the hivemind right now! 🤖🤖🤖`,
		)
	}
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
	areacodeCommand: areacodeCommand,
	archiveCommand: archiveCommand,
	backCommand: backCommand,
	beefcakeCommand: beefcakeCommand,
	bitsCommand: bitsCommand,
	borkedCommand: borkedCommand,
	bdayCommand: bdayCommand,
	brainrotCommand: brainrotCommand,
	burntCommand: burntCommand,
	cakeCommand: cakeCommand,
	cansCommand: cansCommand,
	codeCommand: codeCommand,
	cratestatsCommand: cratestatsCommand,
	dangerCommand: dangerCommand,
	diceCommand: diceCommand,
	dingusCommand: dingusCommand,
	discordCommand: discordCommand,
	ericCommand: ericCommand,
	fadedCommand: fadedCommand,
	floatyCommand: floatyCommand,
	greerCityCommand: greerCityCommand,
	gsdCommand: gsdCommand,
	guttercheckCommand: guttercheckCommand,
	helloCommand: helloCommand,
	highCommand: highCommand,
	hugCommand: hugCommand,
	knowsCommand: knowsCommand,
	linksCommand: linksCommand,
	listCommands: listCommands,
	litCommand: litCommand,
	lurkCommand: lurkCommand,
	mixesCommand: mixesCommand,
	noMicCommand: noMicCommand,
	npChatbotLinkCommand: npChatbotLinkCommand,
	pluribusCommand: pluribusCommand,
	playlistsCommand: playlistsCommand,
	portCommand: portCommand,
	portexCommand: portexCommand,
	postCommand: postCommand,
	primeCommand: primeCommand,
	raidCommand: raidCommand,
	respekCommand: respekCommand,
	risenCommand: risenCommand,
	scCommand: scCommand,
	shoutOutCommand: shoutOutCommand,
	skidaddleCommand: skidaddleCommand,
	smortCommand: smortCommand,
	stuffedCommand: stuffedCommand,
	turntCommand: turntCommand,
	warningCommand: warningCommand,
	vinylCommand: vinylCommand,
	youtubeCommand: youtubeCommand,
	yyCommand: yyCommand,
	// tonightCommand: tonightCommand,
}
