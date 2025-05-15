const countdownCommand = (
	channel,
	tags,
	args,
	client,
	obs,
	sceneChangeLock,
	countdownLock
) => {
	console.log('Countdown command called')
	if (countdownLock.active) {
		client.say(
			channel,
			`${tags.username}, we're already counting down! Try again once the current countdown is finished.`
		)
		return
	} else {
		countdownLock.active = true
		let countdownDuration = 10

		if (args.length === 0) {
			for (let i = 10; i > 0; i--) {
				setTimeout(() => {
					client.say(channel, `${i}...`)
					console.log(countdownLock)
				}, (10 - i) * 1000)
			}
		} else if (parseInt(args[0]) < 31) {
			countdownDuration = parseInt(args[0])
			for (let i = countdownDuration; i > 0; i--) {
				setTimeout(() => {
					client.say(channel, `${i}...`)
				}, (countdownDuration - i) * 1000)
			}
		} else {
			client.say(channel, `I get winded after 30 seconds. Try a lower number.`)
			countdownLock.active = false
			return
		}

		setTimeout(() => {
			countdownLock.active = false
			console.log('Countdown finished, lock released:', countdownLock)
			client.say(channel, '💥💥💥')
		}, countdownDuration * 1000)
	}
}

module.exports = { countdownCommand }
