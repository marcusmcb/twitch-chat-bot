const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

const OPENAI_CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4-turbo'

const getChatGPTResponse = async (prompt) => {
	try {
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: OPENAI_CHAT_MODEL,
				messages: [
					{
						role: 'user',
						content: `${prompt}`,
					},
				],
				max_tokens: 100,
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		)
		const description = response.data.choices[0].message.content
		return description
	} catch (error) {
		console.error(
			'Error fetching player description:',
			error.response ? error.response.data : error.message
		)
		return error.response ? error.response.data : error.message
	}
}

const askGPTCommand = async (channel, tags, args, client) => {	
	const prompt = args.join(' ')
  if (args.length === 0) {
    client.say(channel, `Please provide a prompt for me to respond to!`)
    return
  }
	try {
		await getChatGPTResponse(prompt).then((response) => {
			client.say(channel, `${response}`)
		})
	} catch (error) {
		console.error(error)
	}
}

module.exports = {
	askGPTCommand,
}
