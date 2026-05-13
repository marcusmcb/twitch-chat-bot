const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

const OPENAI_CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4-turbo'

const formatPacificDateForPrompt = (date = new Date()) => {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: 'America/Los_Angeles',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).formatToParts(date)

	const yyyy = parts.find((p) => p.type === 'year')?.value
	const mm = parts.find((p) => p.type === 'month')?.value
	const dd = parts.find((p) => p.type === 'day')?.value

	if (!yyyy || !mm || !dd) {
		const fallback = new Date(date)
		const fYyyy = fallback.getFullYear()
		const fMm = String(fallback.getMonth() + 1).padStart(2, '0')
		const fDd = String(fallback.getDate()).padStart(2, '0')
		return `${fYyyy}-${fMm}-${fDd}`
	}

	return `${yyyy}-${mm}-${dd}`
}

const randomItem = (items) => {
	const index = Math.floor(Math.random() * items.length)
	return items[index]
}

const clampToMaxChars = (text, maxChars) => {
	if (!text) return ''
	const trimmed = String(text).trim()
	return trimmed.length > maxChars ? trimmed.slice(0, maxChars - 1).trimEnd() + '…' : trimmed
}

const tryParseJsonArray = (raw) => {
	if (!raw) return null
	const text = String(raw).trim()
	try {
		const parsed = JSON.parse(text)
		return Array.isArray(parsed) ? parsed : null
	} catch {
		// try to salvage JSON array from a response that included extra text
		const start = text.indexOf('[')
		const end = text.lastIndexOf(']')
		if (start === -1 || end === -1 || end <= start) return null
		const slice = text.slice(start, end + 1)
		try {
			const parsed = JSON.parse(slice)
			return Array.isArray(parsed) ? parsed : null
		} catch {
			return null
		}
	}
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

const normalizeFact = (fact) => {
	if (!fact) return ''
	return clampToMaxChars(String(fact).replace(/\s+/g, ' ').trim(), 500)
}

const getTodayFactsBatch = async (isoDate, { count, excludeIds = [] }) => {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error('OPENAI_API_KEY is not set')
	}

	const safeCount = Math.max(3, Math.min(12, Number(count) || 8))
	const exclude = excludeIds.slice(0, 30).filter(Boolean)

	const response = await axios.post(
		'https://api.openai.com/v1/chat/completions',
		{
			model: OPENAI_CHAT_MODEL,
			temperature: 0.9,
			messages: [
				{
					role: 'system',
					content:
						'You are a Twitch chat bot. Return ONLY valid JSON. Generate multiple distinct "On This Day" facts tied to real past events for the provided date. Never return future events. No disclaimers.',
				},
				{
					role: 'user',
					content: `Date: ${isoDate}.

Return a JSON array of ${safeCount} objects. Each object MUST be:
{ "id": string, "text": string }

Rules for each item:
- "id" is a short kebab-case identifier for the underlying event (<= 60 chars), stable across rephrasings.
- "text" is 1–2 short sentences, <= 500 characters.
- Must reference a real past event that happened on this same month/day and MUST include the year.
- Must include at least one concrete detail (title, name, record, award, score, milestone, etc.).
- Family-friendly, no emojis, no links, no hashtags, no quotes around the whole response.
- IMPORTANT: Do not repeat the same underlying event in different wording.
- Prefer well-known pop-culture (music/film/TV/sports) when possible, but mix categories.

Exclude these event ids (do not use these underlying events): ${exclude.length ? exclude.join(', ') : '(none)'}\n`,
				},
			],
			max_tokens: 900,
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

let todayCache = {
	isoDate: null,
	unused: /** @type {{id: string, text: string}[]} */ ([]),
	usedIds: new Set(),
}

const refillTodayCacheIfNeeded = async (isoDate) => {
	if (todayCache.isoDate !== isoDate) {
		todayCache = { isoDate, unused: [], usedIds: new Set() }
	}

	if (todayCache.unused.length > 0) return

	const excludeIds = Array.from(todayCache.usedIds)
	const raw = await getTodayFactsBatch(isoDate, { count: 8, excludeIds })
	const parsed = tryParseJsonArray(raw)

	if (!parsed) return

	const cleaned = parsed
		.map((item) => {
			if (typeof item === 'string') {
				return { id: '', text: normalizeFact(item) }
			}
			if (!item || typeof item !== 'object') return null
			const id = typeof item.id === 'string' ? item.id.trim() : ''
			const text = normalizeFact(item.text)
			if (!text) return null
			return { id, text }
		})
		.filter(Boolean)
		.filter((item) => {
			if (!item.id) return true
			if (todayCache.usedIds.has(item.id)) return false
			return true
		})

	// De-dupe by id within the fresh batch
	const seen = new Set()
	todayCache.unused = cleaned.filter((item) => {
		const key = item.id || item.text.toLowerCase()
		if (seen.has(key)) return false
		seen.add(key)
		return true
	})
}

const todayCommand = async (channel, tags, args, client) => {
	const isoDate = formatPacificDateForPrompt(new Date())

	try {
		await refillTodayCacheIfNeeded(isoDate)

		let fact = ''
		if (todayCache.unused.length > 0) {
			const selected = randomItem(todayCache.unused)
			todayCache.unused = todayCache.unused.filter((x) => x !== selected)
			if (selected.id) todayCache.usedIds.add(selected.id)
			fact = selected.text
		} else {
			// Fallback to single fact generation
			const raw = await getTodayFact(isoDate)
			fact = clampToMaxChars(raw, 500)
		}

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
