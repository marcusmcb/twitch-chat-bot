const axios = require('axios')
const appConfig = require('../../config/appConfig')
const { toChatMessage } = require('../helpers/chatMessage')

const OPENAI_CHAT_MODEL = appConfig.openAi.chatModel
const MAX_REPLY_LENGTH = 450

const getChatGPTResponse = async (prompt) => {
	const response = await axios.post(
		'https://api.openai.com/v1/chat/completions',
		{
			model: OPENAI_CHAT_MODEL,
			messages: [
				{
					role: 'system',
					content: `You are a Twitch chat bot. Answer in plain prose of 1 to 3 short sentences and stay under ${MAX_REPLY_LENGTH} characters. Never use markdown, lists, line breaks, emojis, or links. Never begin a reply with "/" or ".". Be direct and skip preamble.`,
				},
				{
					role: 'user',
					content: `${prompt}`,
				},
			],
			max_tokens: 160,
		},
		{
			headers: {
				Authorization: `Bearer ${appConfig.openAi.apiKey}`,
				'Content-Type': 'application/json',
			},
		},
	)

	return response?.data?.choices?.[0]?.message?.content ?? ''
}

const askGPTCommand = async (channel, tags, args, client) => {
	const prompt = args.join(' ')
	if (args.length === 0) {
		client.say(channel, `Please provide a prompt for me to respond to!`)
		return
	}
	try {
		const raw = await getChatGPTResponse(prompt)
		const reply = toChatMessage(raw, MAX_REPLY_LENGTH)
		client.say(
			channel,
			reply || "I couldn't come up with an answer for that one.",
		)
	} catch (error) {
		console.error(
			'Error fetching !askgpt response:',
			error?.response ? error.response.data : (error?.message ?? error),
		)
		client.say(channel, 'Sorry, I could not reach my brain just now.')
	}
}

module.exports = {
	askGPTCommand,
}
