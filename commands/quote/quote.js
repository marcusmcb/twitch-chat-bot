const quoteCommand = async (channel, tags, args, client) => {
	let quoteOptions = {
		url: 'https://zenquotes.io/api/random/',
		headers: { Accept: 'application/json' },
	}

	try {
		const response = await fetch(quoteOptions.url, {
			headers: quoteOptions.headers,
			signal: AbortSignal.timeout(5000), // 5 seconds timeout
		})
		if (!response.ok || response.status !== 200) {
			client.say(channel, 'Looks like we are fresh out of quotes right now.')
			console.log(`HTTP ${response.status}: ${response.statusText}`)
			return
		} else {
			const data = await response.json()
			client.say(channel, `'${data[0].q}' - ${data[0].a}`)
		}
	} catch (error) {
		console.error('Error fetching quote:', error.message)
		client.say(channel, 'Looks like we are fresh out of quotes right now.')
	}
}

module.exports = {
	quoteCommand: quoteCommand,
}
