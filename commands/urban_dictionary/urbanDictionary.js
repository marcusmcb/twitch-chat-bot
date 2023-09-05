const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

const getObjectWithMostThumbsUp = (arr) => {
	return arr.reduce((highest, current) => {
		return current.thumbs_up > highest.thumbs_up ? current : highest
	})
}

const argsConverted = (args) => {
	return args.join(' ')
}

const uCommand = async (channel, tags, args, client) => {
	console.log(argsConverted(args))
	const newArgs = argsConverted(args)
	const options = {
		method: 'GET',
		url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
		params: { term: `${newArgs}` },
		headers: {
			'X-RapidAPI-Key': process.env.URBAN_DICTIONARY_API_KEY,
			'X-RapidAPI-Host': process.env.URBAN_DICTIONARY_API_HOST,
		},
	}

	// add logic to limit urban dictionary text response
	// to just < max text limit it twitch chat message

	try {
		const response = await axios.request(options)
		console.log(response.data.list[0])
		if (response.data.list.length === 0) {
			client.say(
				channel,
				`Hmmm... looks like Urban Dictionary couldn't find "${newArgs}"`
			)
			return
		}
		const mostLiked = getObjectWithMostThumbsUp(response.data.list)
		console.log(mostLiked)
		client.say(
			channel,
			`Urban Dictionary result for "${newArgs}": ${response.data.list[0].definition}.`
		)
	} catch (error) {
		console.error(error)
	}
}

module.exports = {
	uCommand: uCommand,
}
