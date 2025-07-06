const fortuneCommand = async (channel, tags, args, client, obs) => {
	let fortuneOptions = {
		url: 'https://aphorismcookie.herokuapp.com',
		headers: { Accept: 'application/json' },
	}

	try {
		const response = await fetch(fortuneOptions.url, {
			headers: fortuneOptions.headers,
			signal: AbortSignal.timeout(5000), // 5 seconds timeout
		})
		if (!response.ok || response.status !== 200) {
			client.say(
				channel,
				"Hmmm... looks like fortunes aren't working right now. 💀"
			)
			console.log(`HTTP ${response.status}: ${response.statusText}`)
			return
		} else {
			const data = await response.json()
			client.say(channel, `${data.data.message}`)
		}
	} catch (error) {
		console.error('Error fetching fortune:', error.message)
		client.say(
			channel,
			"Hmmm... looks like fortunes aren't working right now. 💀"
		)
	}
}

module.exports = {
	fortuneCommand: fortuneCommand,
}
