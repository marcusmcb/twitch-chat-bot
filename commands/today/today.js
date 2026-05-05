const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

const OPENAI_CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4-turbo'

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
			model: OPENAI_CHAT_MODEL,
			temperature: 0.7,
			messages: [
				{
					role: 'system',
					content:
						'You are a Twitch chat bot. Return exactly one family-friendly "On This Day" fact tied to a real past event for the provided date. Never return future, upcoming, speculative, or forecasted events. No disclaimers.',
				},
				{
					role: 'user',
					content: `Date: ${isoDate}. Give one fun, specific "On this date" fact about a person, event, or occasion that happened in the past on this same month/day. It can be music, film, TV, sports, history, politics, or celebrity.
Required output rules:
- Must reference a real past event only (not present/future).
- Must include the year.
- Must include at least one concrete detail (for example: title, person name, record, award, chart position, opening weekend gross, score, milestone).
- Prefer notable pop-culture events when possible.
- 1 to 2 short sentences, <= 500 characters.
- No hashtags, no emojis, no links, no quotes around the whole response.
- If unsure, choose a different event you are confident is real.
Example style: "On this date in 1994, [film/album/person event] happened, and [specific detail]."`,
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
