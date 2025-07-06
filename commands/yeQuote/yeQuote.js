const yeQuoteCommand = async (channel, tags, args, client) => {
	let yeQuoteOptions = {
		url: 'https://api.kanye.rest/',
		headers: { Accept: 'application/json' },
	}

	try {
		const response = await fetch(yeQuoteOptions.url, {
			headers: yeQuoteOptions.headers,
			signal: AbortSignal.timeout(5000), // 5 seconds timeout
		})
		if (!response.ok || response.status !== 200) {
			client.say(channel, "Hmmm... looks like that's not working right now. 💀")
			console.log(`HTTP ${response.status}: ${response.statusText}`)
		} else {
			const data = await response.json()
			client.say(channel, `"${data.quote}" - Kanye West 🐻`)
		}
	} catch (error) {
		console.error('Error fetching Kanye quote:', error.message)
		client.say(channel, "Hmmm... looks like that's not working right now. 💀")
	}
}

module.exports = {
	yeQuoteCommand: yeQuoteCommand,
}
