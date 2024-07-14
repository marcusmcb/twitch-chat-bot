const axios = require('axios')

const fortuneCommand = async (channel, tags, args, client) => {
	let fortuneOptions = {
		url: 'https://aphorismcookie.herokuapp.com',
		headers: { Accept: 'application/json' },
	}

	try {
		const response = await axios(fortuneOptions)
		if (response.data.meta.status === 200) {
			client.say(channel, `${response.data.data.message}`)
		} else {
			client.say(channel, "Hmmm... looks like that's not working right now. 💀")
		}
	} catch (error) {
		client.say(channel, "Hmmm... looks like that's not working right now. 💀")
	}
}

module.exports = {
	fortuneCommand: fortuneCommand,
}
