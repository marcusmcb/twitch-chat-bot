const dadjokeCommand = async (channel, tags, args, client) => {
	let jokeOptions = {
		url: 'https://icanhazdadjoke.com/',
		headers: { Accept: 'application/json' },
	}

	try {
		const response = await fetch(jokeOptions.url, {
			headers: jokeOptions.headers,
			signal: AbortSignal.timeout(5000), // 5 seconds timeout
		})
		if (!response.ok || response.status !== 200) {
			client.say(channel, "Hmmm... looks like that's not working right now. 💀")
			console.log(`HTTP ${response.status}: ${response.statusText}`)
		} else {
			const data = await response.json()
			client.say(channel, `${data.joke}`)
		}
	} catch (error) {
		console.error('Error fetching dad joke:', error.message)
		client.say(channel, "Hmmm... looks like there's no dad jokes right now. 💀")
	}
}

module.exports = {
	dadjokeCommand: dadjokeCommand,
}
