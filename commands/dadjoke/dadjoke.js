const axios = require('axios')

const dadjokeCommand = async (channel, tags, args, client) => {
	let dadJoke
	let jokeOptions = {
		url: 'https://icanhazdadjoke.com/',
		headers: { Accept: 'application/json' },
	}

	try {
		const response = await axios(jokeOptions)
		if (response.status === 200) {
			dadJoke = response.data
			client.say(channel, `${dadJoke.joke}`)
		} else {
			client.say(channel, "Hmmm... looks like that's not working right now. 💀")
		}
	} catch (error) {
		client.say(channel, "Hmmm... looks like that's not working right now. 💀")
	}
}

module.exports = {
	dadjokeCommand: dadjokeCommand,
}
