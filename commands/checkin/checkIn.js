const axios = require('axios')

const ZIP_REGEX = /^\d{5}(-\d{4})?$/

const getLocationFromZip = async (zip) => {
	const zip5 = zip.slice(0, 5)
	const response = await axios.get(`https://api.zippopotam.us/us/${zip5}`)
	const place = response.data?.places?.[0]
	return {
		city: place?.['place name'],
		stateAbbrev: place?.['state abbreviation'],
	}
}

const checkInCommand = async (channel, tags, args, client) => {
	const username = tags?.username ?? 'Someone'
	const userMention = `@${username}`
	const baseMessage = `${userMention} is checked in and ready to have fun! 😁😁😁`

	if (!args || args.length === 0) {
		client.say(channel, baseMessage)
		return
	}

	const zipInput = String(args[0] ?? '').trim()
	if (!ZIP_REGEX.test(zipInput)) {
		client.say(channel, 'Please provide a valid 5-digit US ZIP code (e.g., 92626).')
		return
	}

	try {
		const { city, stateAbbrev } = await getLocationFromZip(zipInput)
		if (!city || !stateAbbrev) {
			client.say(channel, baseMessage)
			return
		}
		client.say(
			channel,
			`${userMention} is checked in from ${city}, ${stateAbbrev} and ready to have fun! 😁😁😁`,
		)
	} catch (error) {
		// Zippopotam.us returns 404 for unknown ZIPs
		client.say(channel, `Sorry, I couldn't find a US location for ZIP ${zipInput}.`)
	}
}

module.exports = {
	checkInCommand,
}
