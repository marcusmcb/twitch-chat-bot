const lightsInfo = (channel, tags, args, client) => {
	client.say(
		channel,
		'You can control my smart lighting by entering !lights and any of the following options: on, off, random, morph, green, blue, red, purple, pink, teal, gold, peach '
	)
}

module.exports = {
	lightsInfo: lightsInfo,
}
