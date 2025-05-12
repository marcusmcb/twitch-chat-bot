const maltCommand = async (channel, tags, args, client) => {
	client.say(
		channel,
		'Our brother @maltliquorkicker needs our help! You can learn more about his journey and donate to the cause here: http://gofund.me/b9d8220f'
	)
}

const lineupCommand = async (channel, tags, args, client) => {
	client.say(channel, 'BLAME MALT! Fundraiser Raid Train Lineup: @djwickit 7pm // @ratewonder 8pm // @mrpofficial 9pm // @djmarcusmcb 10pm // @spicej 11pm // @tycobae 12am // @thefunkhunters 1am // All times are in CST')
}

module.exports = {
	maltCommand: maltCommand,
	lineupCommand: lineupCommand,
}
