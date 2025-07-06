const factCommand = async (channel, tags, args, client) => {
	let options = {
		url: 'https://uselessfacts.jsph.pl/random.json?language=en',
		headers: { Accept: 'application/json' },
	}

	try {
		const response = await fetch(options.url, {
			headers: options.headers,
			signal: AbortSignal.timeout(5000), // 5 seconds timeout
		})
		if (!response.ok || response.status !== 200) {
			client.say(channel, "Hmmm... looks like that's not working right now. 💀")
			console.log(`HTTP ${response.status}: ${response.statusText}`)
		} else {
			const data = await response.json()
			client.say(channel, `Random fact: ${data.text}`)
		}
	} catch (error) {
		console.error('Error fetching random fact:', error.message)
		client.say(channel, "Hmmm... looks like we're out of facts right now. 💀")
	}
}

module.exports = {
	factCommand: factCommand,
}
