const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

const formatDateForPrompt = (date) => {
	const yyyy = date.getFullYear()
	const mm = String(date.getMonth() + 1).padStart(2, '0')
	const dd = String(date.getDate()).padStart(2, '0')
	return `${yyyy}-${mm}-${dd}`
}

const clampToMaxChars = (text, maxChars) => {
	if (!text) return ''
	const trimmed = String(text).trim()
	return trimmed.length > maxChars ? trimmed.slice(0, maxChars - 1).trimEnd() + '…' : trimmed
}

const getTodayFact = async (isoDate) => {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error('OPENAI_API_KEY is not set')
	}

	const response = await axios.post(
		'https://api.openai.com/v1/chat/completions',
		{
			model: 'gpt-3.5-turbo',
			temperature: 0.9,
			messages: [
				{
					role: 'system',
					content:
						'You are a Twitch chat bot. Return exactly one fun, random fact about the given calendar date. Keep it family-friendly and suitable for a public stream. No disclaimers.',
				},
				{
					role: 'user',
					content: `Give one fun pop-culture-leaning fact about ${isoDate}. It can be music, film, TV, sports, history, politics, or celebrity. Requirements: <= 500 characters, one sentence (or two short sentences), no hashtags, no emojis, no quotes around the whole response.`,
				},
			],
			max_tokens: 140,
		},
		{
			headers: {
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				'Content-Type': 'application/json',
			},
		},
	)

	return response?.data?.choices?.[0]?.message?.content ?? ''
}

const todayCommand = async (channel, tags, args, client) => {
	const isoDate = formatDateForPrompt(new Date())

	try {
		const raw = await getTodayFact(isoDate)
		const fact = clampToMaxChars(raw, 500)

		if (!fact) {
			client.say(channel, `I couldn't think of a good "on this day" fact for ${isoDate}—try again!`)
			return
		}

		client.say(channel, fact)
	} catch (error) {
		console.error(
			'Error fetching !today response:',
			error?.response ? error.response.data : error?.message ?? error,
		)
		client.say(channel, 'Sorry—my brain is offline right now. Try !today again in a bit.')
	}
}

module.exports = {
	todayCommand,
}
