const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

const getChatGPTResponse = async (prompt) => {
	try {
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-3.5-turbo',
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
